<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';
require_once './functions.php';

global $wpdb;
$activities_table = DB_PREFIX . 'activities';

$activity_slug = array_key_exists('activity', $_GET) ? $_GET['activity'] : null;

if ($activity_slug !== null) {
    $activity_id = $wpdb->get_var(
        "SELECT id
        FROM $activities_table
        WHERE slug = '$activity_slug'"
    );
} else $activity_id = null;

echo json_encode(get_performance($current_user_id, $activity_id));
