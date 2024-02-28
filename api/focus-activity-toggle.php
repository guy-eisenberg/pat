<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$focus_activities_table = DB_PREFIX . 'focus_activities';

$activity_id = $_POST['activity_id'];

$focused = $wpdb->get_row(
    "SELECT *
    FROM $focus_activities_table
    WHERE activity_id = $activity_id
    AND user_id = $current_user_id"
) !== null;

if ($focused) {
    $wpdb->delete($focus_activities_table, ['user_id' => $current_user_id, 'activity_id' => $_POST['activity_id']]);
    echo false;
} else {
    $wpdb->insert($focus_activities_table, ['user_id' => $current_user_id, 'activity_id' => $_POST['activity_id']]);
    echo true;
}
