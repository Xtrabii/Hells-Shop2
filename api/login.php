<?php
require_once('./db.php');

function loginUser($username, $password) {
    global $db;

    try {
        // ค้นหาผู้ใช้โดยใช้ชื่อผู้ใช้
        $stmt = $db->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // เช็ครหัสผ่าน
            if (password_verify($password, $user['password'])) {
                session_start();
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                return array('success' => true, 'message' => 'เข้าสู่ระบบสำเร็จ');
            } else {
                return array('success' => false, 'message' => 'รหัสผ่านไม่ถูกต้อง');
            }
        } else {
            return array('success' => false, 'message' => 'ไม่พบชื่อผู้ใช้');
        }
    } catch (PDOException $e) {
        return array('success' => false, 'message' => 'มีข้อผิดพลาดเกิดขึ้นในการล็อกอิน: ' . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $result = loginUser($username, $password);

        header('Content-Type: application/json');
        echo json_encode($result);
    } else {
        echo json_encode(array('success' => false, 'message' => 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'));
    }
} else {
    echo json_encode(array('success' => false, 'message' => 'เฉพาะเมธอด POST เท่านั้นที่รองรับ'));
}
?>
