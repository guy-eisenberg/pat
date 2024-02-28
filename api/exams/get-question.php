<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';
require_once 'functions.php';

global $wpdb;

$question_id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

if ($question_id) {
    $questions_table = DB_PREFIX . 'exams_questions';

    $question = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT * 
            FROM $questions_table 
            WHERE id = %s",
            [$question_id]
        )
    );

    if ($question) {
        $res = flat_question($question);

        echo json_encode($res);
    } else {
        http_response_code(404);
        die('Not Found');
    }
}
