<?php

require_once './init-auth.php';

require_once 'functions.php';

$json = file_get_contents('php://input');
$params = json_decode($json, true);

if (array_key_exists('assessment', $params)) {
    $res = replace_assessment($params['assessment']);

    echo json_encode($res);
}
