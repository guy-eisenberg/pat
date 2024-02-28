<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$activities_table = DB_PREFIX . 'activities';

$res = $wpdb->get_results(
    "SELECT * 
    FROM $activities_table"
);

echo json_encode($res);
