<?php

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$activities_table = DB_PREFIX . 'activities';
$results_table = DB_PREFIX . 'results';

$activities_ids = $wpdb->get_col(
    "SELECT id
    FROM $activities_table"
);
$available_modes = ["normal", "normal", "normal", "training"];

$user_id = 1;
$other_user_id = 2;

$today = date('Y-m-d');

function insert_result($user_id)
{
    global $wpdb;
    global $results_table;
    global $activities_ids;
    global $available_modes;
    global $cur_date;

    $hour = wp_rand(0, 23);
    $minutes = wp_rand(0, 59);
    $seconds = wp_rand(0, 59);

    $time = date('Y-m-d H:i:s', strtotime("$cur_date $hour:$minutes:$seconds"));

    $wpdb->insert($results_table, [
        "user_id" => $user_id,
        "activity_id" => $activities_ids[array_rand($activities_ids)],
        "score" => wp_rand(1, 100),
        "duration" => wp_rand(60, 1200),
        "mode" => $available_modes[array_rand($available_modes)],
        "time" => $time
    ]);
}

for ($i = 1; $i <= 90; $i++) {
    $cur_date = date('Y-m-d', strtotime("$today -$i days"));

    $user_insert_count = wp_rand(0, 7);
    $other_user_insert_count = wp_rand(0, 7);

    for ($j = 0; $j < $user_insert_count; $j++) insert_result($user_id);
    for ($j = 0; $j < $other_user_insert_count; $j++) insert_result($other_user_id);
}

echo 'Success';
