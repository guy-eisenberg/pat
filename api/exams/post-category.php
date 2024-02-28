<?php

require_once __DIR__ . '/../init-auth.php';

require_once 'functions.php';

$exam_id = array_key_exists('exam-id', $_GET) ? $_GET['exam-id'] : null;

if ($exam_id) {
    $categories_table = DB_PREFIX . 'exams_categories';

    $json = file_get_contents('php://input');
    $params = json_decode($json, true);

    if (array_key_exists('category', $params)) {
        $res = replace_category(
            $params['category'],
            $exam_id,
            array_key_exists('parent_category_id', $params) ? $params['parent_category_id'] : null
        );

        echo json_encode($res);
    }
}
