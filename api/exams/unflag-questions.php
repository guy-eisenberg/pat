<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';

global $wpdb;
$flagged_questions_table = DB_PREFIX . 'exams_flagged_questions';

echo print_r(explode(',', $_GET['ids']), true);

if (array_key_exists('ids', $_GET)) {
    $ids = explode(',', $_GET['ids']);

    foreach ($ids as $id) $wpdb->delete($flagged_questions_table, ['user_id' => $current_user_id, 'question_id' => $id]);
}
