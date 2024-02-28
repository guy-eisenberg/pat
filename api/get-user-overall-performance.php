<?php

require './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';
require_once './functions.php';

global $wpdb;
$options_table = DB_PREFIX . 'options';
$activities_table = DB_PREFIX . 'activities';
$skill_categories_table = DB_PREFIX . 'skill_categories';
$activities_skill_categories_table = DB_PREFIX . 'activities_skill_categories';
$focus_activities_table = DB_PREFIX . 'focus_activities';
$results_table = DB_PREFIX . 'results';

$performance = get_performance($current_user_id, null);

$today = date('Y-m-d');
$three_days_ago = date('Y-m-d', strtotime("$today -3 day"));

$slow_improvement_rate = $wpdb->get_var(
    "SELECT option_value
    FROM $options_table
    WHERE option_name = 'improvement_slow_rate'"
);

$fast_improvement_rate = $wpdb->get_var(
    "SELECT option_value
    FROM $options_table
    WHERE option_name = 'improvement_fast_rate'"
);

// Get all activities performances:
$activities = $wpdb->get_results(
    "SELECT id, name, short_name, total_duration, last_use, user_scores, other_users_scores, user_scores_three_days_ago, IF(focus=1, 'true', 'false') AS focus
    FROM $activities_table

    JOIN (
        SELECT activity_id, SUM(duration) AS total_duration, GROUP_CONCAT(score ORDER BY time DESC) AS user_scores, MAX(time) AS last_use
        FROM $results_table
        WHERE user_id = $current_user_id
        AND mode = 'normal'
        GROUP BY activity_id
    ) AS user_results
    ON user_results.activity_id = $activities_table.id

    LEFT JOIN (
        SELECT activity_id, GROUP_CONCAT(score ORDER BY time DESC) AS user_scores_three_days_ago
        FROM $results_table
        WHERE user_id = $current_user_id
        AND mode = 'normal'
        AND time <= '$three_days_ago'
        GROUP BY activity_id
    ) AS user_results_three_days_ago
    ON user_results_three_days_ago.activity_id = $activities_table.id

    LEFT JOIN (
        SELECT activity_id, GROUP_CONCAT(score ORDER BY time DESC) AS other_users_scores
        FROM $results_table
        WHERE user_id != $current_user_id
        AND mode = 'normal'
        GROUP BY activity_id
    ) AS other_users_results
    ON other_users_results.activity_id = $activities_table.id
    
    LEFT JOIN (
        SELECT activity_id, COUNT(*) AS focus
        FROM $focus_activities_table
        WHERE user_id = $current_user_id
        GROUP BY activity_id
    ) AS user_focus_activities
    ON user_focus_activities.activity_id = $activities_table.id"
);

// echo json_encode($activities);
// die();

$activities = array_map(function ($activity) use ($slow_improvement_rate, $fast_improvement_rate) {
    $user_scores = array_map('intval', explode(',', $activity->user_scores));
    unset($activity->user_scores);

    $recent_user_scores = array_slice($user_scores, 0, min(3, count($user_scores)));
    $user_score = count($recent_user_scores) > 0 ? intval(array_sum($recent_user_scores) / count($recent_user_scores)) : null;
    $activity->score = $user_score;

    $first_scores_median = 0;
    if (count($user_scores) >= 2) {
        $scores_chunks = partition($user_scores, min(3, count($user_scores) - 1));

        $first_scores = $scores_chunks[count($scores_chunks) - 1];
        if (is_array($first_scores)) {
            sort($first_scores);

            $first_scores_median = get_array_median($first_scores);
        } else
            $first_scores_median = $first_scores;
    }

    if (count($user_scores) >= 2)
        $activity->scores_segments = [$first_scores_median, $user_score];
    else $activity->scores_segments = [$user_score];

    if ($activity->other_users_scores !== null) {
        $other_users_scores = array_map('intval', explode(',', $activity->other_users_scores));
        unset($activity->other_users_scores);
    } else $other_users_scores = [];

    $median = null;
    if ($user_score !== null && count($other_users_scores) >= 3) {
        $score_chunks = partition($other_users_scores, 3);

        $low_score = get_array_median($score_chunks[0]);
        $high_score = get_array_median($score_chunks[2]);

        if ($user_score <= $low_score) $median = 'below';
        else if ($user_score >= $high_score) $median = 'above';
        else $median = 'average';
    } else $median = 'average';

    $activity->median = $median;

    if ($activity->user_scores_three_days_ago !== null) {
        $user_scores_three_days_ago = array_map('intval', explode(',', $activity->user_scores_three_days_ago));
        unset($activity->user_scores_three_days_ago);
    } else $user_scores_three_days_ago = [];

    $recent_user_scores_three_days_ago = array_slice($user_scores_three_days_ago, 0, min(3, count($user_scores_three_days_ago)));
    $user_score_three_days_ago = count($recent_user_scores_three_days_ago) > 0 ? intval(array_sum($recent_user_scores_three_days_ago) / count($recent_user_scores_three_days_ago)) : null;

    $activity->increased_score = $user_score > $user_score_three_days_ago;

    $improvement_rate_three_days_ago = get_regression_prediction(array_reverse($user_scores_three_days_ago), 0)['m'];
    $improvement_rate_today = get_regression_prediction(array_reverse($user_scores), 0)['m'];

    $activity->increased_improvement = $improvement_rate_today > $improvement_rate_three_days_ago;

    $activity->improvement_rate = $improvement_rate_today;
    $activity->improvement_rate_speed = $improvement_rate_today >= $fast_improvement_rate ? 'fast' : ($improvement_rate_today < $slow_improvement_rate ? 'slow' : 'medium');

    $activity->last_use = strtotime($activity->last_use);

    $activity->focus = $activity->focus === 'true';

    return $activity;
}, $activities);

$skills = $wpdb->get_results(
    "SELECT name, skill_results.*, user_scores_three_days_ago, other_users_scores

    FROM $skill_categories_table

    JOIN (
        SELECT skill_category_id AS id, SUM(duration) AS total_duration, MAX(time) AS last_use, GROUP_CONCAT(score ORDER BY time DESC) AS user_scores
        FROM $skill_categories_table
        JOIN (
            SELECT skill_category_id, T2.*
            FROM $activities_skill_categories_table
            JOIN (
                SELECT *
                FROM $results_table
                WHERE user_id = $current_user_id
                AND mode = 'normal'
            ) AS T2
            USING (activity_id)
        ) AS T1
        ON T1.skill_category_id = $skill_categories_table.id
        GROUP BY id
    ) AS skill_results
    USING (id)

    LEFT JOIN (
        SELECT skill_category_id AS id, GROUP_CONCAT(score ORDER BY time DESC) AS user_scores_three_days_ago
        FROM $skill_categories_table
        JOIN (
            SELECT skill_category_id, T2.*
            FROM $activities_skill_categories_table
            JOIN (
                SELECT *
                FROM $results_table
                WHERE user_id = $current_user_id
                AND mode = 'normal'
                AND time <= '$three_days_ago'
            ) AS T2
            USING (activity_id)
        ) AS T1
        ON T1.skill_category_id = $skill_categories_table.id
        GROUP BY id
    ) AS skill_results_three_days_ago
    USING (id)

    LEFT JOIN (
        SELECT skill_category_id AS id, GROUP_CONCAT(score ORDER BY time DESC) AS other_users_scores
        FROM $skill_categories_table
        JOIN (
            SELECT skill_category_id, T2.*
            FROM $activities_skill_categories_table
            JOIN (
                SELECT *
                FROM $results_table
                WHERE user_id != $current_user_id
                AND mode = 'normal'
            ) AS T2
            USING (activity_id)
        ) AS T1
        ON T1.skill_category_id = $skill_categories_table.id
        GROUP BY id
    ) AS skill_other_users_results
    USING (id)"
);

$skills = array_map(function ($skill) use ($slow_improvement_rate, $fast_improvement_rate) {
    $user_scores = array_map('intval', explode(',', $skill->user_scores));
    unset($skill->user_scores);

    $recent_user_scores = array_slice($user_scores, 0, min(3, count($user_scores)));
    $user_score = count($recent_user_scores) > 0 ? intval(array_sum($recent_user_scores) / count($recent_user_scores)) : null;
    $skill->score = $user_score;

    $first_scores_median = 0;
    if (count($user_scores) >= 2) {
        $scores_chunks = partition($user_scores, min(3, count($user_scores) - 1));

        $first_scores = $scores_chunks[count($scores_chunks) - 1];
        if (is_array($first_scores)) {
            sort($first_scores);

            $first_scores_median = get_array_median($first_scores);
        } else
            $first_scores_median = $first_scores;
    }

    if (count($user_scores) >= 2)
        $skill->scores_segments = [$first_scores_median, $user_score];
    else $skill->scores_segments = [$user_score];

    $other_users_scores = array_map('intval', explode(',', $skill->other_users_scores));
    unset($skill->other_users_scores);

    $median = null;
    if ($user_score !== null && count($other_users_scores) >= 3) {
        $score_chunks = partition($other_users_scores, 3);

        $low_score = get_array_median($score_chunks[0]);
        $high_score = get_array_median($score_chunks[2]);

        if ($user_score <= $low_score) $median = 'below';
        else if ($user_score >= $high_score) $median = 'above';
        else $median = 'average';
    } else $median = 'average';

    $skill->median = $median;

    $user_scores_three_days_ago = array_map('intval', explode(',', $skill->user_scores_three_days_ago));
    unset($skill->user_scores_three_days_ago);

    $recent_user_scores_three_days_ago = array_slice($user_scores_three_days_ago, 0, min(3, count($user_scores_three_days_ago)));
    $user_score_three_days_ago = count($recent_user_scores_three_days_ago) > 0 ? intval(array_sum($recent_user_scores_three_days_ago) / count($recent_user_scores_three_days_ago)) : null;

    $skill->increased_score = $user_score > $user_score_three_days_ago;

    $improvement_rate_three_days_ago = get_regression_prediction(array_reverse($user_scores_three_days_ago), 0)['m'];
    $improvement_rate_today = get_regression_prediction(array_reverse($user_scores), 0)['m'];

    $skill->increased_improvement = $improvement_rate_today > $improvement_rate_three_days_ago;

    $skill->improvement_rate_speed = $improvement_rate_today >= $fast_improvement_rate ? 'fast' : ($improvement_rate_today < $slow_improvement_rate ? 'slow' : 'medium');

    $skill->last_use = strtotime($skill->last_use);

    return $skill;
}, $skills);

$res = array_merge(
    $performance,
    [
        'activities' => $activities,
        'skills' => $skills
    ]
);

echo json_encode($res);
