<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';
require_once 'functions.php';

$exam_id = array_key_exists('exam-id', $_GET) ? $_GET['exam-id'] : null;
if (!$exam_id) die("Exam id not specified");

global $wpdb;
$customizations_table = DB_PREFIX . 'exams_customizations';

$customizations = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT *
            FROM $customizations_table
            WHERE user_id = %s
            AND exam_id = %s",
        [$current_user_id, $exam_id]
    )
);

$res = array_map(function ($customization) {
    return flat_customization($customization);
}, $customizations);

echo json_encode($res);
