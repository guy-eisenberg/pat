<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$targets_table = DB_PREFIX . 'targets';
$activities_table = DB_PREFIX . 'activities';
$skill_categories_table = DB_PREFIX . 'skill_categories';

$activities_targets = $wpdb->get_results(
    "SELECT $targets_table.*, $activities_table.name as target_name
    FROM $targets_table
    
    JOIN $activities_table
    ON $targets_table.target_type = 'activity'
    AND $targets_table.target_id = $activities_table.id

    WHERE user_id = $current_user_id"
);

$skills_targets = $wpdb->get_results(
    "SELECT $targets_table.*, $skill_categories_table.name as target_name
    FROM $targets_table

    JOIN $skill_categories_table
    ON $targets_table.target_type = 'skill'
    AND $targets_table.target_id = $skill_categories_table.id

    WHERE user_id = $current_user_id"
);

$targets = array_merge($activities_targets, $skills_targets);

$activities = $wpdb->get_results(
    "SELECT *
    FROM $activities_table"
);
$skill_categories = $wpdb->get_results(
    "SELECT *
    FROM $skill_categories_table"
);

$flat_targets = array_map(function ($target) {
    $passed = strtotime($target->end_time) <= time();

    return [
        "id" => $target->id,
        "name" => $target->target_name,
        "type" => $target->type,
        "target_type" => $target->target_type,
        "target_id" => $target->target_id,
        "status" =>  $target->progress == 100 ? 'achieved' : ($passed ? 'missed' : 'active'),
        "figure" => $target->figure,
        "progress" => $target->progress,
        "start_time" => strtotime($target->start_time) * 1000,
        "end_time" => strtotime($target->end_time) * 1000,
        "achieve_time" => strtotime($target->achieve_time) * 1000
    ];
}, $targets);

echo json_encode([
    "user_targets" => $flat_targets,
    "available_targets" => array_merge(
        array_map(function ($activity) {
            return [
                "key" => "activity-" . $activity->id,
                "label" => $activity->name,
                "type" => "Activity"
            ];
        }, $activities),
        array_map(function ($skill) {
            return [
                "key" => "skill-" . $skill->id,
                "label" => $skill->name,
                "type" => "skill"
            ];
        }, $skill_categories)
    )
]);
