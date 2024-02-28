<?php

global $wpdb;
$activities_table = DB_PREFIX . 'activities';
$focus_activities_table = DB_PREFIX . 'focus_activities';

$current_user_id = get_current_user_id();

$focus_activities = $wpdb->get_results(
    "SELECT $activities_table.*
    FROM $focus_activities_table
    JOIN $activities_table
    ON $focus_activities_table.user_id = $current_user_id AND $activities_table.id = $focus_activities_table.activity_id"
);

$activity_items = [];

foreach ($focus_activities as $activity)
    array_push($activity_items, do_shortcode("[pat-activity-box activity=\"$activity->slug\" only_focused=\"true\"]"));

?>

<div class="focus-activities-list">
    <?php foreach ($activity_items as $item) echo $item ?>
</div>