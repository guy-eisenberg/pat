<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;

$activity_id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

if ($activity_id) {
    $activities_table = DB_PREFIX . 'activities';

    $wpdb->delete($activities_table, ['id' => $activity_id]);
}
