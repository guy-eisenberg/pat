<?php

require_once 'init-auth.php';
require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$activities_table = DB_PREFIX . 'activities';

$activity = $wpdb->get_row(
    "SELECT *
    FROM $activities_table
    WHERE id = $current_activity_id"
);

echo json_encode($activity);
