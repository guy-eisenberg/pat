<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$activities_table = DB_PREFIX . 'activities';
$skill_categories_table = DB_PREFIX . 'skill_categories';
$results_table = DB_PREFIX . 'results';
$targets_table = DB_PREFIX . 'targets';

if ($current_user_id === 0) {
    http_response_code(403);
    die("Anauthorized");
}

$json = file_get_contents('php://input');
$params = json_decode($json, true);

if (array_key_exists('days', (array) $params)) {
    $flat_days = [];

    $month_start = date("Y-m-d H:i:s", (intval($params['days'][0]['start'] / 1000)));
    $month_end = date("Y-m-d H:i:s", (intval($params['days'][count($params['days']) - 1]['end'] / 1000)));

    $results = $wpdb->get_results(
        "SELECT $results_table.*, $activities_table.id as id , $activities_table.name as activity_name, $activities_table.short_name as short_name, $activities_table.image as activity_image
        FROM $results_table

        JOIN $activities_table
        ON $results_table.activity_id = $activities_table.id

        WHERE user_id = $current_user_id
        AND time BETWEEN '$month_start' AND '$month_end'"
    );

    $activities_targets = $wpdb->get_results(
        "SELECT $targets_table.*, $activities_table.name as target_name
        FROM $targets_table
        
        JOIN $activities_table
        ON $targets_table.target_type = 'activity'
        AND $targets_table.target_id = $activities_table.id

        WHERE user_id = $current_user_id
        AND start_time BETWEEN '$month_start' AND '$month_end'
        OR end_time BETWEEN '$month_start' AND '$month_end'
        OR achieve_time BETWEEN '$month_start' AND '$month_end'"
    );

    $skills_targets = $wpdb->get_results(
        "SELECT $targets_table.*, $skill_categories_table.name as target_name
        FROM $targets_table

        JOIN $skill_categories_table
        ON $targets_table.target_type = 'skill'
        AND $targets_table.target_id = $skill_categories_table.id

        WHERE user_id = $current_user_id
        AND start_time BETWEEN '$month_start' AND '$month_end'
        OR end_time BETWEEN '$month_start' AND '$month_end'
        OR achieve_time BETWEEN '$month_start' AND '$month_end'"
    );

    $targets = array_merge($activities_targets, $skills_targets);

    foreach ($params['days'] as $day) {
        $day_start = $day['start'] / 1000;
        $day_end = $day['end'] / 1000;

        $day_results = array_filter($results, function ($result) use ($day_start, $day_end) {
            $time = strtotime($result->time);

            return ($time >= $day_start && $time <= $day_end);
        });

        $flat_day_results = array_map(function ($result) use ($wpdb, $results_table, $current_user_id) {
            $high_score = $wpdb->get_row(
                "SELECT *
                FROM $results_table
                WHERE user_id = $current_user_id
                AND activity_id = $result->activity_id
                AND time < '$result->time'
                AND score >= $result->score"
            ) === null;

            $users_results = $wpdb->get_results(
                "SELECT *
                FROM $results_table
                WHERE activity_id = $result->activity_id
                AND time < '$result->time'
                ORDER BY score"
            );

            $one_third = count($users_results) >= 20 ? $users_results[count($users_results) / 3]->score : -1;
            $two_third = count($users_results) >= 20 ? $users_results[(count($users_results) / 3) * 2]->score : 101;

            return [
                "id" => $result->id,
                "name" => $result->activity_name,
                "short_name" => $result->short_name,
                "image" => $result->activity_image,
                "score" => intval($result->score),
                "mode" => $result->mode,
                "from" => ((strtotime($result->time) - $result->duration) * 1000),
                "to" => strtotime($result->time) * 1000,
                "duration" => intval($result->duration),
                "high_score" => $high_score,
                "stanine" => ($result->score > $one_third ? ($result->score > $two_third ? 'above' : 'average') : 'below')
            ];
        }, $day_results);

        $day_targets = array_filter($targets, function ($target) use ($day_start, $day_end) {
            $start_time = strtotime($target->start_time);
            $end_time = strtotime($target->end_time);
            $achieve_time = null;

            if ($target->achieve_time)
                $achieve_time = strtotime($target->achieve_time);

            return (
                ($start_time >= $day_start && $start_time <= $day_end)
                ||
                ($end_time >= $day_start && $end_time <= $day_end)
                ||
                ($achieve_time >= $day_start && $achieve_time <= $day_end)
            );
        });

        $flat_day_targets = [];
        foreach ($day_targets as $target) {
            $start_time = strtotime($target->start_time);
            $end_time = strtotime($target->end_time);
            $achieve_time = null;

            if ($target->achieve_time)
                $achieve_time = strtotime($target->achieve_time);

            $data = [
                "target_id" => $target->target_id,
                "target_type" => $target->target_type,
                "name" => $target->target_name,
                "type" => $target->type,
                "figure" => intval($target->figure),
                "start_time" => $start_time * 1000,
                "end_time" => $end_time * 1000,
                "achieve_time" => $achieve_time * 1000
            ];

            if ($start_time >= $day_start && $start_time <= $day_end)
                array_push($flat_day_targets, array_merge(["status" => 'set', "time" => ($start_time * 1000)], $data));

            if ($target->progress < 100 && ($end_time >= $day_start && $end_time <= $day_end))
                array_push($flat_day_targets, array_merge(["status" => $end_time < time() ? 'missed' : 'future-expire', "time" => ($end_time * 1000)], $data));

            if ($target->progress == 100 && ($achieve_time >= $day_start && $achieve_time <= $day_end))
                array_push($flat_day_targets, array_merge(["status" => 'achieved', "time" => ($achieve_time * 1000)], $data));
        }

        array_push($flat_days, array(
            "results" => array_values($flat_day_results),
            "targets" => array_values($flat_day_targets)
        ));
    }

    echo json_encode(array_values($flat_days));
}
