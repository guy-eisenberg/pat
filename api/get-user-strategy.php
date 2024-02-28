<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;

$posts_table = $wpdb->prefix . 'posts';

$activities_table = DB_PREFIX . 'activities';
$targets_table = DB_PREFIX . 'targets';
$skill_categories_table = DB_PREFIX . 'skill_categories';
$strategies_table = DB_PREFIX . 'strategies';
$assessments_table = DB_PREFIX . 'assessments';
$assessors_table = DB_PREFIX . 'assessors';
$strategies_skill_categories_table = DB_PREFIX . 'strategies_skill_categories';
$strategies_activities_table = DB_PREFIX . 'strategies_activities';
$strategies_articles_table = DB_PREFIX . 'strategies_articles';
$strategies_targets_table = DB_PREFIX . 'strategies_targets';

$user_meta = get_userdata($current_user_id);

$strategy = $wpdb->get_row(
    "SELECT *
    FROM $strategies_table
    WHERE user_id = $current_user_id"
);

if (!$strategy) {
    echo json_encode(null);
    die();
}

if ($strategy->assessment_id) {
    $assessment = $wpdb->get_row(
        "SELECT *
        FROM $assessments_table
        WHERE id = $strategy->assessment_id"
    );

    $focus_assessment_name = $assessment->name;
} else {
    $assessment = $wpdb->get_row(
        "SELECT $assessments_table.*
        FROM $assessments_table

        JOIN $assessors_table
        ON $assessors_table.id = $strategy->assessor_id
        AND $assessors_table.assessment_id = $assessments_table.id"
    );

    $focus_assessment_name = $assessment->name;
}

$skill_categories = $wpdb->get_results(
    "SELECT *
    FROM $skill_categories_table
    JOIN $strategies_skill_categories_table
    ON $strategies_skill_categories_table.skill_category_id = $skill_categories_table.id
    AND $strategies_skill_categories_table.strategy_id = $strategy->id"
);

$skill_categories_names = array_map(function ($skill_category) {
    return $skill_category->name;
}, $skill_categories);

if ($strategy->assessor_id) {
    $assessor = $wpdb->get_row(
        "SELECT *
        FROM $assessors_table
        WHERE id = $strategy->assessor_id"
    );
}

$activities = $wpdb->get_results(
    "SELECT $activities_table.*, $strategies_activities_table.type as segment
    FROM $activities_table
    JOIN $strategies_activities_table
    ON $strategies_activities_table.strategy_id = $strategy->id
    AND $strategies_activities_table.activity_id = $activities_table.id"
);

$articles = $wpdb->get_results(
    "SELECT $posts_table.*, $strategies_articles_table.type as segment
    FROM $posts_table
    JOIN $strategies_articles_table
    ON $strategies_articles_table.strategy_id = $strategy->id
    AND $strategies_articles_table.article_id = $posts_table.ID"
);

$flat_articles = array_map(function ($article) {
    return [
        "id" => $article->ID,
        "name" => $article->post_title,
        "href" => get_permalink($article->ID),
        "segment" => $article->segment
    ];
}, $articles);

$activities_targets = $wpdb->get_results(
    "SELECT $targets_table.*, $strategies_targets_table.type as segment, $activities_table.name
    FROM $targets_table
    JOIN $strategies_targets_table
    ON $strategies_targets_table.strategy_id = $strategy->id
    AND $strategies_targets_table.target_id = $targets_table.id
    JOIN $activities_table
    ON $targets_table.target_type = 'activity'
    AND $targets_table.target_id = $activities_table.id"
);
$skill_targets = $wpdb->get_results(
    "SELECT $targets_table.*, $strategies_targets_table.type as segment, $skill_categories_table.name
    FROM $targets_table
    JOIN $strategies_targets_table
    ON $strategies_targets_table.strategy_id = $strategy->id
    AND $strategies_targets_table.target_id = $targets_table.id
    JOIN $skill_categories_table
    ON $targets_table.target_type = 'skill'
    AND $targets_table.target_id = $skill_categories_table.id"
);

$flat_strategy = [
    "id" => $strategy->id,
    "assessor_name" => $assessor ? $assessor->name : null,
    "assessor_color" => $assessor ? $assessor->color :  '#34424C',
    "assessor_image" => $assessor ? $assessor->image : PAT_PLUGIN_URL . '/assets/default-assessor-image.png',
    "assessor_image_prep" => $assessor ? $assessor->image : PAT_PLUGIN_URL . '/assets/default-assessor-image-prep.png',
    "assessment_date" => strtotime($strategy->assessment_date) * 1000,
    "focus_assessment_name" => $focus_assessment_name,
    "skill_categories_names" => $skill_categories_names,
    "activities" => $activities,
    "articles" => $flat_articles,
    "targets" => array_merge((array)$activities_targets, (array)$skill_targets)
];

echo json_encode($flat_strategy);
