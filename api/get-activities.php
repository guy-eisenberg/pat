<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$activities_table = DB_PREFIX . 'activities';
$activities_skill_categories_table = DB_PREFIX . 'activities_skill_categories';
$skill_categories_table = DB_PREFIX . 'skill_categories';

$activities = $wpdb->get_results("SELECT * FROM $activities_table");

$skill_categories = $wpdb->get_results(
    "SELECT $activities_table.id as activity_id, $skill_categories_table.id as id, $skill_categories_table.name as name
    FROM $activities_table
    JOIN $activities_skill_categories_table
    ON $activities_skill_categories_table.activity_id = $activities_table.id
    JOIN $skill_categories_table
    ON $skill_categories_table.id = $activities_skill_categories_table.skill_category_id"
);

$flat_activities = array_map(function ($activity) use ($skill_categories) {
    $activity_skill_categories = [];

    foreach ($skill_categories as $skill_category) {
        if ($skill_category->activity_id === $activity->id)
            array_push($activity_skill_categories, $skill_category);
    }

    return array_merge((array) $activity, [
        "skill_categories" => array_map(function ($skill_category) {
            return ["id" => $skill_category->id, 'name' => $skill_category->name];
        }, $activity_skill_categories)
    ]);
}, $activities);

echo json_encode($flat_activities);
