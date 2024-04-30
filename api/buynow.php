<?php
    require_once('./db.php');

    try {
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $fname = $_POST['fname'];
            $lname = $_POST['lname'];
            $email = $_POST['email'];
            $tel = $_POST['tel'];
            $address = $_POST['address'];
            $country = $_POST['country'];
            $state = $_POST['state'];
            $zip = $_POST['zip'];
            $product = $_POST['product'];
            $object = new stdClass();
            $amount = 0;
            $product = $_POST['product'];

            $stmt = $db->prepare('select id,price from product  ');
            if($stmt->execute()) {

                $queryproduct = array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);  
                    $item = array(
                        "id" => $id,
                        "price" => $price,
                    );
                    array_push($queryproduct , $item);
                }
                for ($i=0; $i < count($product) ; $i++) { 
                    for ($k=0; $k < count($queryproduct) ; $k++) { 
                        if( intval($product[$i]['id']) == intval($queryproduct[$k]['id']) ) {
                            $amount += intval($product[$i]['count']) * intval($queryproduct[$k]['price']);
                            break;
                        }
                    }
                }
                $shipping = $amount + 60;
                $vat = $shipping * 7 / 100;
                $netamount = $shipping + $vat;
                $transid = round(microtime(true) * 1000);
                $product = json_encode($product);
                $mil = time() * 1000;
                $updated_at = date("Y-m-d h:i:sa");

                $stmt = $db->prepare('insert into transaction (transid,orderlist,amount,shipping,vat,netamount,operation,mil,updated_at,fname,lname,email,tel,address,country,state,zip) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
                if($stmt->execute([
                    $transid, $product, $amount, $shipping, $vat, $netamount, 'PENDING', $mil, $updated_at, $fname, $lname, $email, $tel, $address, $country, $state, $zip
                ])) {
                    $object->RespCode = 200;
                    $object->RespMessage = 'success';
                    $object->Amount = new stdClass();
                    $object->Amount->Amount = $amount;
                    $object->Amount->Shipping = $shipping;
                    $object->Amount->Vat = $vat;
                    $object->Amount->Netamount = $netamount;
                    http_response_code(200);
                }
                else {
                    $object->RespCode = 300;
                    $object->Log = 0;
                    $object->RespMessage = 'notgood : insert transaction fail';
                    http_response_code(300);
                }
            }
            else {
                $object->RespCode = 500;
                $object->Log = 1;
                $object->RespMessage = 'notgood : cannot get product';
                http_response_code(500);
            }
            echo json_encode($object);
        }
        else {
            http_response_code(405);
        }
    }
    catch(PDOException $e) {
        http_response_code(500);
        echo $e->getMessage();
    }
?>