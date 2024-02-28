<?php

require './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';
require_once 'functions.php';

global $wpdb;
$activities_table = DB_PREFIX . 'activities';
$activities_skill_categories_table = DB_PREFIX . 'activities_skill_categories';;
$skill_categories_table = DB_PREFIX . 'skill_categories';
$results_table = DB_PREFIX . 'results';
$targets_table = DB_PREFIX . 'targets';

$dates = array_key_exists('dates', $_GET) ? array_map(function ($date) {
    return date('Y-m-d', intval($date / 1000));
}, explode(',', $_GET['dates'])) : null;
$activity_id = array_key_exists('activity', $_GET) ? $_GET['activity'] : null;
$skill_id = array_key_exists('skill', $_GET) ? $_GET['skill'] : null;
$tz = array_key_exists('tz', $_GET) ? $_GET['tz'] : 'UTC';

$date_from = $dates[0];
$date_to = $dates[count($dates) - 1];

$activity_filter_query =  $activity_id !== null ? "AND activity_id = $activity_id" : "";
$skill_filter_query = $skill_id !== null ?
    "AND activity_id IN (
        SELECT activity_id
        FROM $activities_skill_categories_table
        WHERE skill_category_id = $skill_id
    )"
    : "";

$performances = $wpdb->get_results(
    "SELECT t1.*,
    GROUP_CONCAT(activities_skill_categories.skill_category_id) AS skill_ids,
    GROUP_CONCAT(activities_skill_categories.skill_name)        AS skill_names
FROM (SELECT t1.*,
          GROUP_CONCAT(other_users_normal_results.score ORDER BY
                       other_users_normal_results.score) AS other_users_normal_scores
   FROM (SELECT t1.*,
                GROUP_CONCAT(all_user_results.score) AS user_scores
         FROM (SELECT $results_table.*,
                      $activities_table.name,
                      $activities_table.short_name,
                      $activities_table.page_hyperlink as hyperlink,
                      $activities_table.image,
                      IF(MAX(user_better_scores.score) IS NULL, 'true', 'false') AS high_score
               FROM $results_table

                        JOIN $activities_table
                             ON $activities_table.id = $results_table.activity_id

                        LEFT JOIN (SELECT activity_id, time, score
                                   FROM $results_table

                                   WHERE user_id = $current_user_id) AS user_better_scores
                                  ON user_better_scores.activity_id = $results_table.activity_id
                                      AND user_better_scores.time < $results_table.time
                                      AND user_better_scores.score > $results_table.score

               WHERE user_id = $current_user_id
                 AND CAST($results_table.time AS DATE) BETWEEN '$date_from' AND '$date_to'

               GROUP BY $results_table.id) AS t1

                  LEFT JOIN (SELECT activity_id, time, score
                             FROM $results_table

                             WHERE user_id = $current_user_id) AS all_user_results
                            ON all_user_results.activity_id = t1.activity_id
                                AND all_user_results.time <= t1.time

         GROUP BY t1.id) AS t1

            LEFT JOIN (SELECT activity_id, time, score
                       FROM $results_table

                       WHERE user_id != $current_user_id
                         AND mode = 'normal') AS other_users_normal_results
                      ON other_users_normal_results.activity_id = t1.activity_id
                          AND other_users_normal_results.time < t1.time

   GROUP BY t1.id) AS t1

      LEFT JOIN (SELECT activity_id, skill_category_id, name as skill_name
                 FROM $activities_skill_categories_table

                          JOIN $skill_categories_table
                               ON $skill_categories_table.id =
                                  $activities_skill_categories_table.skill_category_id) AS activities_skill_categories
                ON activities_skill_categories.activity_id = t1.activity_id

GROUP BY t1.id"
);

$previous_results = $wpdb->get_results(
    "SELECT CAST(time AS DATE) AS date, score
    FROM $results_table
    WHERE user_id = $current_user_id
    AND time <= '$date_to'
    AND mode = 'normal'
    $activity_filter_query
    $skill_filter_query
    ORDER BY time DESC"
);

$targets_activity_filter_query = $activity_id !== null ?
    "AND $targets_table.target_type = 'activity'
    AND $targets_table.target_id = $activity_id"
    : "";

$targets_skill_filter_query = $skill_id !== null ?
    "AND $targets_table.target_type = 'activity'
    AND $targets_table.target_id IN (
        SELECT activity_id
        FROM $activities_skill_categories_table
        WHERE skill_category_id = $skill_id
    )
    OR (
        $targets_table.target_type = 'skill'
        AND $targets_table.target_id = $skill_id
    )"
    : "";

$targets = $wpdb->get_results(
    "SELECT $targets_table.id, CASE WHEN target_type = 'activity' THEN $activities_table.name ELSE $skill_categories_table.name END AS name, target_type, target_id, type, figure, progress, start_time, end_time, achieve_time
    FROM $targets_table

    LEFT JOIN $activities_table
    ON $targets_table.target_type = 'activity'
    AND $activities_table.id = $targets_table.target_id

    LEFT JOIN $skill_categories_table
    ON $targets_table.target_type = 'skill'
    AND $skill_categories_table.id = $targets_table.target_id

    WHERE user_id = $current_user_id
    $targets_activity_filter_query
    $targets_skill_filter_query
    AND ((start_time BETWEEN '$date_from' AND '$date_to')
    OR (progress < 100 AND (end_time BETWEEN '$date_from' AND CURDATE()))
    OR (progress = 100 AND (achieve_time BETWEEN '$date_from' AND '$date_to')))"
);

$activity_by_dates = [];

$normal_results_by_dates = [];
foreach ($performances as $result) {
    $date = date('Y-m-d', strtotime($result->time));
    $previous_date = date('Y-m-d', strtotime($result->time) - $result->duration);

    $other_users_normal_scores = $result->other_users_normal_scores !== null ? array_map('intval', explode(',', $result->other_users_normal_scores)) : null;

    $one_third = $other_users_normal_scores && count($other_users_normal_scores) >= 20 ? $other_users_normal_scores[intval(count($other_users_normal_scores) / 3)] : -1;
    $two_third = $other_users_normal_scores && count($other_users_normal_scores) >= 20 ? $other_users_normal_scores[intval((count($other_users_normal_scores) / 3) * 2)] : 101;

    if ($result->user_scores !== null) {
        $user_scores = array_map('intval', explode(',', $result->user_scores));
    } else $user_scores = [];

    $first_scores_median = 0;
    if (count($user_scores) > 1) {
        $scores_chunks = partition($user_scores, min(4, count($user_scores) - 1));
        $first_scores = $scores_chunks[count($scores_chunks) - 1];
        if (is_array($first_scores)) {
            sort($first_scores);
            $first_scores_median = get_array_median($first_scores);
        }
    }

    safe_push($activity_by_dates[$date]["results"], [
        "activity_type" => 'result',
        "activity_id" => $result->activity_id,
        "skill_names" => $result->skill_names !== null ? explode(',', $result->skill_names) : [],
        "skill_ids" => $result->skill_ids !== null ? explode(',', $result->skill_ids) : [],
        "id" => $result->id,
        "name" => $result->name,
        "short_name" => $result->short_name,
        "hyperlink" => $result->hyperlink,
        "score" => intval($result->score),
        "first_scores_median" => $first_scores_median,
        "high_score" => $result->high_score === 'true',
        "stanine" => ($result->score > $one_third ? ($result->score > $two_third ? 'above' : 'average') : 'below'),
        "duration" => intval($result->duration),
        "mode" => $result->mode,
        "image" => $result->image,
        "from" => (strtotime($result->time) - intval($result->duration)) * 1000,
        "to" => strtotime($result->time) * 1000,
        "time" => strtotime($result->time) * 1000,
    ]);

    if ($result->mode === 'training') continue;

    safe_push($normal_results_by_dates[$date], $result);

    if ($date !== $previous_date)
        safe_push($normal_results_by_dates[$previous_date], $result);
}

$today = date('Y-m-d', time());

foreach ($targets as $target) {
    $target_data = [
        "activity_type" => 'target',
        "id" => $target->id,
        "name" => $target->name,
        "target_type" => $target->target_type,
        "type" => $target->type,
        "figure" => $target->figure,
        "start_time" => strtotime($target->start_time) * 1000,
        "end_time" => strtotime($target->end_time) * 1000,
        "achieve_time" => $target->achieve_time !== null ? strtotime($target->achieve_time) * 1000 : null,
    ];

    $start_date = date('Y-m-d', strtotime($target->start_time));


    safe_push($activity_by_dates[$start_date]['targets'], array_merge(
        $target_data,
        [
            "status" => "set",
            "time" => strtotime($target->start_time) * 1000,
        ]
    ));

    $end_date = date('Y-m-d', strtotime($target->end_time));

    if ($target->progress < 100 && $end_date < $today)
        safe_push($activity_by_dates[$end_date], array_merge(
            $target_data,
            [
                "status" => "missed",
                "time" => strtotime($target->end_time) * 1000,
            ]
        ));
    else if ($target->progress == 100) {
        $achieve_date = date('Y-m-d', strtotime($target->achieve_time));

        safe_push($activity_by_dates[$achieve_date], array_merge(
            $target_data,
            [
                "status" => "achieved",
                "time" => strtotime($target->achieve_time) * 1000,
            ]
        ));
    }
}

$performances = array_map(function ($date) use ($tz, $skill_id, $activity_by_dates, $normal_results_by_dates, $previous_results) {
    $has_matching_normal_results = array_key_exists($date, $normal_results_by_dates);

    $has_matching_results = isset($activity_by_dates[$date]['results']);
    $has_matching_targets = isset($activity_by_dates[$date]['targets']);

    if ($has_matching_results) {
        usort($activity_by_dates[$date]['results'], function ($a1, $a2) {
            $v = $a1['time'] - $a2['time'];

            return $v;
        });
    }

    $activities = array_key_exists($date, $activity_by_dates) ? array_merge(
        $has_matching_results ? $activity_by_dates[$date]['results'] : [],
        $has_matching_targets ? $activity_by_dates[$date]['targets'] : []
    ) : [];
    usort($activities, function ($a1, $a2) {
        $v = $a1['time'] - $a2['time'];

        return $v;
    });

    $current_date = [
        "date" => strtotime($date) * 1000,
        "time_breakdown" => [0, 0, 0, 0, 0, 0],
        "time_breakdown_components" => [
            "activities" => [],
            "skills" => []
        ],
        "improvement_breakdown_components" => [
            "activities" => [],
            "skills" => []
        ],
        "activity" => $activities,
    ];
    $normal_results = $has_matching_normal_results ? $normal_results_by_dates[$date] : [];

    $results_scores = array_map(function ($result) {
        return $result->score;
    }, array_filter($normal_results, function ($result) use ($date) {
        return date('Y-m-d', strtotime($result->time)) === $date;
    }));
    $current_date['score'] = $has_matching_normal_results ? intval(array_sum($results_scores) / count($results_scores)) : null;

    if ($has_matching_results) {
        $results_durations = array_map(function ($activity_result) use ($tz, $date, &$current_date) {
            $end_time = $activity_result['time'] / 1000;

            $start_time = $end_time - $activity_result['duration'];

            $duration = 0;
            for ($i = 0; $i < 6; $i++) {
                $current_time_line = strtotime($date . ' ' . $tz) + ($i * 14400);
                $next_time_line = $current_time_line + 14400;

                if ($end_time < $current_time_line) break;
                else if ($start_time <= $current_time_line && $end_time >= $current_time_line)
                    $current_duration = $end_time - $current_time_line;
                else if ($start_time >= $current_time_line && $end_time <= $next_time_line)
                    $current_duration = $activity_result['duration'];
                else if ($start_time <= $next_time_line && $end_time >= $next_time_line)
                    $current_duration = $end_time - $next_time_line;
                else if ($start_time <= $current_time_line && $end_time >= $next_time_line)
                    $current_duration = 14400;
                else $current_duration = 0;

                $current_date['time_breakdown'][$i] += $current_duration;
                $duration += $current_duration;
            }

            return $duration;
        }, $activity_by_dates[$date]['results']);

        $current_date['total_duration'] = array_sum($results_durations);

        foreach ($activity_by_dates[$date]['results'] as $result) {
            $activity_id = $result['activity_id'];
            $activity_name = $result['name'];
            $skill_ids = $result['skill_ids'];
            $duration = $result['duration'];
            $score = $result['score'];
            $first_scores_median = $result['first_scores_median'];

            foreach ($skill_ids as $i => $current_skill_id) {
                if ($skill_id !== null && $current_skill_id !== $skill_id) continue;

                $skill_name = $result['skill_names'][$i];

                if (isset($current_date["time_breakdown_components"]['skills'][$skill_name]))
                    $current_date["time_breakdown_components"]['skills'][$skill_name]['time'] += $duration;
                else {
                    $current_date["time_breakdown_components"]['skills'][$skill_name] = [
                        "component_id" => $current_skill_id,
                        "name" => $skill_name,
                        "time" => $duration
                    ];
                }

                if (isset($current_date["improvement_breakdown_components"]['skills'][$skill_name]))
                    $current_date["improvement_breakdown_components"]['skills'][$skill_name]['score_segments'] = [$first_scores_median, $score];
                else {
                    $current_date["improvement_breakdown_components"]['skills'][$skill_name] = [
                        "component_id" => $current_skill_id,
                        "name" => $skill_name,
                        "score_segments" => [$first_scores_median, $score]
                    ];
                }
            }

            if (isset($current_date["time_breakdown_components"]['activities'][$activity_name]))
                $current_date["time_breakdown_components"]['activities'][$activity_name]['time'] += $duration;
            else {
                $current_date["time_breakdown_components"]['activities'][$activity_name] = [
                    "component_id" => $activity_id,
                    "name" => $activity_name,
                    "time" => $duration
                ];
            }

            if (isset($current_date["improvement_breakdown_components"]['activities'][$activity_name]))
                $current_date["improvement_breakdown_components"]['activities'][$activity_name]['score_segments'] = [$first_scores_median, $score];
            else {
                $current_date["improvement_breakdown_components"]['activities'][$activity_name] = [
                    "component_id" => $activity_id,
                    "name" => $activity_name,
                    "score_segments" => [$first_scores_median, $score]
                ];
            }
        }

        $current_date["time_breakdown_components"]['activities'] = array_values($current_date["time_breakdown_components"]['activities']);
        usort($current_date["time_breakdown_components"]['activities'], function ($a1, $a2) {
            $v = $a2['time'] - $a1['time'];

            return $v;
        });

        $current_date["time_breakdown_components"]['skills'] = array_values($current_date["time_breakdown_components"]['skills']);
        usort($current_date["time_breakdown_components"]['skills'], function ($a1, $a2) {
            $v = $a2['time'] - $a1['time'];

            return $v;
        });

        $current_date["improvement_breakdown_components"]['activities'] = array_values($current_date["improvement_breakdown_components"]['activities']);
        $current_date["improvement_breakdown_components"]['skills'] = array_values($current_date["improvement_breakdown_components"]['skills']);
    } else $current_date['total_duration'] = null;

    $first_previous_score_index = null;
    foreach ($previous_results as $i => $previous_result) {
        if (strtotime($previous_result->date) <= strtotime($date)) {
            $first_previous_score_index = $i;
            break;
        }
    }

    if ($first_previous_score_index !== null) {
        $previous_results_scores = array_map(function ($result) {
            return $result->score;
        }, $previous_results);

        $previous_user_scores = array_slice($previous_results_scores, $first_previous_score_index, count($previous_results_scores) - 1);
    }

    $current_date['improvement_rate'] = isset($previous_user_scores) && count($previous_user_scores) >= 3 ? get_regression_prediction(array_reverse($previous_user_scores), 0)['m'] : null;

    return $current_date;
}, $dates);

$available_activities = $wpdb->get_results(
    "SELECT id, name, short_name
    FROM $activities_table
    ORDER BY name"
);
$available_activities = array_map(function ($activity) {
    return [
        "id" => $activity->id,
        "name" => $activity->name,
        "short_name" => $activity->short_name
    ];
}, $available_activities);

$available_skills = $wpdb->get_results(
    "SELECT id, name
    FROM $skill_categories_table
    ORDER BY name"
);
$available_skills = array_map(function ($skill) {
    return [
        "id" => $skill->id,
        "name" => $skill->name
    ];
}, $available_skills);

echo json_encode([
    "performances" => $performances,
    "available_activities" => $available_activities,
    "available_skills" => $available_skills
]);
