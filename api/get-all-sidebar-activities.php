<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';
require_once './functions.php';

global $wpdb;
$activities_table = DB_PREFIX . 'activities';
$activities_last_use_table = DB_PREFIX . 'activities_last_use';
$focus_activities_table = DB_PREFIX . 'focus_activities';
$results_table = DB_PREFIX . 'results';

$activities = $wpdb->get_results(
    "SELECT $activities_table.*,  $activities_last_use_table.time as last_use
    FROM $activities_table
    LEFT JOIN $activities_last_use_table
    ON $activities_last_use_table.user_id = $current_user_id
    AND $activities_last_use_table.activity_id = $activities_table.id"
);

$focus_activities = $wpdb->get_col(
    "SELECT activity_id
    FROM $focus_activities_table
    WHERE user_id = $current_user_id"
);

$results = $wpdb->get_results(
    "SELECT *
    FROM $results_table
    WHERE mode = 'normal'
    ORDER BY score ASC"
);

$flat_activities = array_map(function ($activity) use ($current_user_id, $results, $focus_activities) {
    $user_activity_results = array_map(function ($result) {
        return $result->score;
    }, array_filter($results, function ($result) use ($current_user_id, $activity) {
        return $result->user_id == $current_user_id && $result->activity_id === $activity->id;
    }));

    $user_score = count($user_activity_results) > 0 ? intval(array_sum($user_activity_results) / count($user_activity_results)) : null;
    $median = null;

    if ($user_score !== null) {
        $activity_results = array_map(function ($result) {
            return $result->score;
        }, array_filter($results, function ($result) use ($current_user_id, $activity) {
            return $result->user_id != $current_user_id && $result->activity_id === $activity->id;
        }));

        if (count($activity_results) >= 3) {
            $score_chunks = partition($activity_results, 3);

            // echo json_encode($score_chunks);
            // die();

            $low_score = array_sum($score_chunks[0]) / count($score_chunks[0]);
            $high_score = array_sum($score_chunks[2]) / count($score_chunks[2]);

            if ($user_score <= $low_score) $median = 'below';
            else if ($user_score >= $high_score) $median = 'above';
            else $median = 'average';
        } else $median = 'average';
    }

    $activity->legacy = $activity->legacy === '1';
    $activity->focus = array_search($activity->id, $focus_activities) !== false;
    $activity->score = $user_score;
    $activity->median = $median;
    $activity->last_use = $activity->last_use !== null ? strtotime($activity->last_use) * 1000 : 0;
}, $activities);

echo json_encode($activities);
