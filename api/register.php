<?php
require_once('./db.php');

function registerUser($username, $password, $email) {
    global $db;

    try {
        // เช็คว่ามีชื่อผู้ใช้หรืออีเมล์ซ้ำไหม
        $stmt = $db->prepare("SELECT * FROM users WHERE username = :username OR email = :email");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            return array('success' => false, 'message' => 'ชื่อผู้ใช้หรืออีเมล์นี้มีอยู่ในระบบแล้ว');
        } else {
            // เพิ่มผู้ใช้ใหม่ลงในฐานข้อมูล
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $db->prepare("INSERT INTO users (username, password, email) VALUES (:username, :password, :email)");
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            return array('success' => true, 'message' => 'ลงทะเบียนสำเร็จ');
        }
    } catch (PDOException $e) {
        return array('success' => false, 'message' => 'มีข้อผิดพลาดเกิดขึ้นในการสมัครสมาชิก: ' . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // เช็คว่าส่งข้อมูลมาครบหรือไม่
    if (isset($_POST['username']) && isset($_POST['password']) && isset($_POST['email'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];
        $email = $_POST['email'];

        $result = registerUser($username, $password, $email);

        header('Content-Type: application/json');
        echo json_encode($result);
    } else {
        echo json_encode(array('success' => false, 'message' => 'กรุณากรอกข้อมูลที่จำเป็น'));
    }
} else {
    echo json_encode(array('success' => false, 'message' => 'เฉพาะเมธอด POST เท่านั้นที่รองรับ'));
}
?>
