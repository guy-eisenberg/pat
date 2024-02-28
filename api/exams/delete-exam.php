<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';

global $wpdb;

$exam_id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

if ($exam_id) {
    $exams_table = DB_PREFIX . 'exams';
    try{
        $wpdb->delete($exams_table, ['id' => $exam_id]);
    } catch (Exception $e) {
        var_dump($e->getMessage());exit;
    }
}
