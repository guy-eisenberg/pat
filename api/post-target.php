<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';
require_once 'functions.php';

$json = file_get_contents('php://input');
$params = json_decode($json, true);

if (array_key_exists('target', $params)) {
    $res = replace_target($params['target'], $current_user_id);

    echo json_encode($res);
}
