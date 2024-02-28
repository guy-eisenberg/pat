<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';

global $wpdb;

$question_id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

if ($question_id) {
    $questions_table = DB_PREFIX . 'exams_questions';

    $wpdb->delete($questions_table, ['id' => $question_id]);
}
