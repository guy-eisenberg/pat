<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

$activity_id = $_GET['activity_id'];

global $wpdb;
$activities_last_use_table = DB_PREFIX . 'activities_last_use';

$activity_time_entry_exists = $wpdb->get_var(
    "SELECT *
    FROM $activities_last_use_table
    WHERE user_id = $current_user_id
    AND activity_id = $activity_id"
);

if ($activity_time_entry_exists)
    $wpdb->update(
        $activities_last_use_table,
        [
            "time" => date("Y-m-d H:i:s", time())
        ],
        [
            "user_id" => $current_user_id,
            "activity_id" => $activity_id,
        ]
    );
else
    $wpdb->insert($activities_last_use_table, [
        "user_id" => $current_user_id,
        "activity_id" => $activity_id,
        "time" => date("Y-m-d H:i:s", time())
    ]);

session_start();

$_SESSION['current_activity_id'] = $activity_id;
