<?php

require_once __DIR__ . '/../init-auth.php';

require_once 'functions.php';

$json = file_get_contents('php://input');
$params = json_decode($json, true);
if (array_key_exists('exam', $params)) {
    $res = replace_exam($params['exam']);

    echo json_encode($res);
}
