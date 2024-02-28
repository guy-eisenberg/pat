<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';

global $wpdb;
$flagged_questions_table = DB_PREFIX . 'exams_flagged_questions';

$rows = $wpdb->get_results("SELECT question_id FROM $flagged_questions_table WHERE user_id = $current_user_id");

echo json_encode(array_map(function ($row) {
    return $row->question_id;
}, $rows));
