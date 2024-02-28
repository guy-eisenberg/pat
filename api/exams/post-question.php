<?php

require_once __DIR__ . '/../init-auth.php';

require_once 'functions.php';

$category_id = array_key_exists('category-id', $_GET) ? $_GET['category-id'] : null;

if ($category_id) {
    $json = file_get_contents('php://input');
    $params = json_decode($json, true);

    if (array_key_exists('question', $params)) {
        $res = replace_question(
            $params['question'],
            $category_id
        );

        echo json_encode($res);
    }
}
