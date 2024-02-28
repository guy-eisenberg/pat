<?php

require_once './init-auth.php';

session_start();

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$results_table = DB_PREFIX . 'results';
$targets_table = DB_PREFIX . 'targets';
$activities_skill_categories_table = DB_PREFIX . 'activities_skill_categories';

$json = file_get_contents('php://input');
$params = json_decode($json, true);

if (array_key_exists('score', (array) $params) && array_key_exists('duration', $params) && array_key_exists('mode', $params)) {
    $wpdb->insert($results_table, [
        "user_id" => $current_user_id,
        "activity_id" => $current_activity_id,
        "score" => $params['score'],
        "duration" => $params['duration'],
        "mode" => $params['mode'],
        "time" => date("Y-m-d H:i:s", time())
    ]);

    $user_targets = $wpdb->get_results(
        "SELECT *
        FROM $targets_table
        
        WHERE user_id = $current_user_id
        AND progress < 100
        AND end_time > NOW()
        AND target_type = 'activity'
        AND target_id = $current_activity_id

        UNION

        SELECT $targets_table.*
        FROM $targets_table

        JOIN $activities_skill_categories_table
        ON $targets_table.target_type = 'skill'
        AND $targets_table.target_id = $activities_skill_categories_table.skill_category_id
        AND $activities_skill_categories_table.activity_id = $current_activity_id

        WHERE $targets_table.user_id = $current_user_id
        AND $targets_table.progress < 100
        AND end_time > NOW()"
    );

    foreach ($user_targets as $target) {
        $should_update_target = $params['mode'] === 'normal' ? true : ($target->type === 'time' ? true : false);
        if (!$should_update_target) continue;

        $new_progress = 0;

        if ($target->type === 'score')
            $new_progress = ($params['score'] / $target->figure) * 100;
        else if ($target->type === 'improvement') {
            $past_results = $wpdb->get_results(
                "SELECT *
                FROM $results_table
                WHERE user_id = $current_user_id
                AND activity_id = $current_activity_id
                AND mode = 'normal'
                AND time < '$target->start_time'"
            );

            $past_results_score_avg =
                count($past_results) > 0
                ?
                array_reduce($past_results, function ($sum, $result) {
                    return $sum + $result->score;
                }) / count($past_results)
                :
                0;

            $new_improvement =
                $past_results_score_avg > 0
                ?
                ((($params['score'] - $past_results_score_avg) / $past_results_score_avg) * 100)
                :
                $target->figure;

            $new_progress = ($new_improvement / $target->figure) * 100;
        } else if ($target->type === 'time') {
            $target_time = $target->figure * 3600;

            $duration_prec = ($params['duration'] / $target_time) * 100;

            $new_progress = $target->progress + $duration_prec;
        }

        if ($new_progress >= 100)
            $wpdb->update(
                $targets_table,
                [
                    'progress' => 100,
                    'achieve_time' => date("Y-m-d H:i:s", time())
                ],
                ['id' => $target->id]
            );
        else if ($new_progress > $target->progress)
            $wpdb->update(
                $targets_table,
                [
                    "progress" => $new_progress,
                ],
                ['id' => $target->id]
            );
    }
}
