<?php

require_once './init-auth.php';

session_start();

require_once __DIR__ . '/../../../../wp-load.php';
require_once 'functions.php';

global $wpdb;
$results_table = DB_PREFIX . 'results';

$other_users_results = $wpdb->get_results(
    "SELECT *
    FROM $results_table
    WHERE user_id != $current_user_id
    AND activity_id = $current_activity_id"
);

$past_results = $wpdb->get_results(
    "SELECT *
    FROM $results_table
    WHERE user_id = $current_user_id
    AND activity_id = $current_activity_id
    ORDER BY time DESC
    LIMIT 5"
);

$flat_past_results = array_map(function ($result) {
    return [
        "id" => $result->id,
        "score" => intval($result->score),
        "start_time" => ((strtotime($result->time) - $result->duration) * 1000),
        "end_time" => strtotime($result->time) * 1000,
        "mode" => $result->mode
    ];
}, $past_results);

if (count($other_users_results) >= 3) {
    $median_score = array_reduce($other_users_results, function ($sum, $result) {
        return $sum + $result->score;
    }) / count($other_users_results);
} else {
    $median_score = 50;
}

$other_users_scores = array_map(function ($result) {
    return $result->score;
}, $other_users_results);

$median = 'average';
if (count($other_users_scores) >= 3) {
    $score_chunks = partition($other_users_scores, 3);

    $low_score = get_array_median($score_chunks[0]);
    $high_score = get_array_median($score_chunks[2]);
};

echo json_encode(["median_score" => $median_score, "weak_pass" => $low_score, "strong_pass" => $high_score, "past_results" => $flat_past_results]);
