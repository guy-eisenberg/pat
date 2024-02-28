<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;

$posts_table = $wpdb->prefix . 'posts';

$assessments_table = DB_PREFIX . 'assessments';
$assessments_activities_table = DB_PREFIX . 'assessments_activities';
$assessments_articles_table = DB_PREFIX . 'assessments_articles';
$activities_table = DB_PREFIX . 'activities';

$assessments = $wpdb->get_results(
    "SELECT * 
    FROM $assessments_table"
);

$flat_assessments = array_map(function ($assessment) use ($wpdb, $assessments_activities_table, $assessments_articles_table, $activities_table, $posts_table) {
    $related_activities = $wpdb->get_results(
        "SELECT $activities_table.*
        FROM $assessments_activities_table
        JOIN $activities_table
        ON $assessments_activities_table.activity_id = $activities_table.id
        AND $assessments_activities_table.assessment_id = $assessment->id"
    );

    $related_articles = $wpdb->get_results(
        "SELECT *
        FROM $assessments_articles_table
        JOIN $posts_table
        ON $assessments_articles_table.article_id = $posts_table.ID
        AND $assessments_articles_table.assessment_id = $assessment->id"
    );

    $flat_articles = array_map(function ($article) {
        return [
            "id" => $article->ID,
            "title" => $article->post_title,
        ];
    }, $related_articles);

    return array_merge(
        (array)$assessment,
        [
            "activities" => $related_activities,
            "articles" => $flat_articles
        ]
    );
}, $assessments);

echo json_encode($flat_assessments);
