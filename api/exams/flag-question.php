<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';

global $wpdb;

$question_id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

if ($question_id) {
    $flagged_questions_table = DB_PREFIX . 'exams_flagged_questions';

    $wpdb->insert($flagged_questions_table, ["user_id" => $current_user_id, "question_id" => $question_id]);
}
