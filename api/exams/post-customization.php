<?php

require_once __DIR__ . '/../init-auth.php';

require_once 'functions.php';

$json = file_get_contents('php://input');
$params = json_decode($json, true);

if (array_key_exists('customization', (array) $params))
    $res = replace_customization($params['customization'], $current_user_id);
