<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';
require_once 'functions.php';

global $wpdb;
$exams_table = DB_PREFIX . 'exams';

$exams = $wpdb->get_results("SELECT * FROM $exams_table");

$res = array_map(function ($exam) {
    return flat_exam($exam);
}, $exams);

echo json_encode($res);
