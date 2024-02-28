<?php

require_once __DIR__ . '/../../../../wp-load.php';

if (!function_exists('replace_activity')) {
    function replace_activity($activity)
    {
        $activity_table = DB_PREFIX . 'activities';

        $activity_data = $activity;
        unset($activity_data['skill_categories']);

        $activity_id = replace($activity_table, $activity_data);

        insert_activity_skill_categories($activity_id, $activity['skill_categories']);

        return $activity_id;
    }
}

if (!function_exists('replace_target')) {
    function replace_target($target, $user_id)
    {
        $targets_table = DB_PREFIX . 'targets';

        [$target_type, $target_id] = explode('-', $target['target']);

        $target_id = replace($targets_table, [
            "id" => $target['id'],
            "user_id" => $user_id,
            "target_type" => $target_type,
            "target_id" => $target_id,
            "type" => $target['type'],
            "figure" => $target['figure'],
            "start_time" => $target['start_time'] ? date("Y-m-d H:i:s", ($target['start_time'] / 1000)) : date("Y-m-d H:i:s", time()),
            "end_time" => date("Y-m-d H:i:s", ($target['end_time'] / 1000))
        ]);

        return $target_id;
    }
}

if (!function_exists('replace_assessment')) {
    function replace_assessment($assessment)
    {
        $assessments_table = DB_PREFIX . 'assessments';

        $assessment_id = replace($assessments_table, [
            "id" => $assessment['id'],
            "name" => $assessment['name'],
        ]);

        insert_assessment_activities($assessment_id, $assessment['activities']);
        insert_assessment_articles($assessment_id, $assessment['articles']);

        return $assessment_id;
    }
}

if (!function_exists('replace_assessor')) {
    function replace_assessor($assessor)
    {
        $assessors_table = DB_PREFIX . 'assessors';

        $assessor_id = replace($assessors_table, [
            "id" => $assessor['id'],
            "name" => $assessor['name'],
            "type" => $assessor['type'],
            "assessment_id" => $assessor["assessment"]["id"],
            "color" => $assessor['color'],
            "image" => array_key_exists('image', $assessor) ? $assessor['image'] : null
        ]);

        return $assessor_id;
    }
}

if (!function_exists('replace')) {
    function replace($table, $data)
    {
        global $wpdb;

        $replace_id = $data['id'];

        $result = $wpdb->update($table, $data, ['id' => $replace_id]);

        if ($result === false || $result === 0) {
            $id_exists = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT *
                    FROM $table
                    WHERE id = %s",
                    [$replace_id]
                )
            ) !== null;

            if (!$id_exists) {
                $wpdb->insert($table, $data);

                $replace_id = $wpdb->insert_id;
            }
        }

        return $replace_id;
    }
}

if (!function_exists('insert_activity_skill_categories')) {
    function insert_activity_skill_categories($activity_id, $skill_categories)
    {
        global $wpdb;
        $activities_skill_categories_table = DB_PREFIX . 'activities_skill_categories';

        $skill_categories_ids = array_map(
            function ($category) {
                return $category['id'];
            },
            $skill_categories
        );

        $existing_skill_categories = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT *
                FROM $activities_skill_categories_table
                WHERE activity_id = %s",
                [$activity_id]
            )
        );

        $existing_skill_categories_ids = array_map(
            function ($existing_skill_category) {
                return $existing_skill_category->skill_category_id;
            },
            $existing_skill_categories
        );

        // Add new skill categories:
        foreach ($skill_categories_ids as $skill_category_id)
            if (!in_array($skill_category_id, $existing_skill_categories_ids))
                $wpdb->insert(
                    $activities_skill_categories_table,
                    [
                        'activity_id' => $activity_id,
                        'skill_category_id' => $skill_category_id
                    ]
                );

        // Remove unneeded skill categories:
        foreach ($existing_skill_categories_ids as $existing_skill_category_id)
            if (!in_array($existing_skill_category_id, $skill_categories_ids))
                $wpdb->delete(
                    $activities_skill_categories_table,
                    [
                        'activity_id' => $activity_id,
                        'skill_category_id' => $existing_skill_category_id
                    ]
                );
    }
}

if (!function_exists('insert_assessment_activities')) {
    function insert_assessment_activities($assessment_id, $activities)
    {
        global $wpdb;
        $assessments_activities_table = DB_PREFIX . 'assessments_activities';

        $new_activities_ids = array_map(
            function ($activity) {
                return $activity['id'];
            },
            $activities
        );

        $existing_activities = $wpdb->get_results(
            "SELECT *
            FROM $assessments_activities_table
            WHERE assessment_id = $assessment_id"
        );

        $existing_activities_ids = array_map(
            function ($existing_activity) {
                return $existing_activity->activity_id;
            },
            $existing_activities
        );

        // Add new skill categories:
        foreach ($new_activities_ids as $new_activity_id)
            if (!in_array($new_activity_id, $existing_activities_ids))
                $wpdb->insert(
                    $assessments_activities_table,
                    [
                        'assessment_id' => $assessment_id,
                        'activity_id' => $new_activity_id
                    ]
                );

        // Remove unneeded skill categories:
        foreach ($existing_activities_ids as $existing_activity_id)
            if (!in_array($existing_activity_id, $new_activities_ids))
                $wpdb->delete(
                    $assessments_activities_table,
                    [
                        'assessment_id' => $assessment_id,
                        'activity_id' => $existing_activity_id
                    ]
                );
    }
}

if (!function_exists('insert_assessment_articles')) {
    function insert_assessment_articles($assessment_id, $articles)
    {
        global $wpdb;
        $assessments_articles_table = DB_PREFIX . 'assessments_articles';

        $articles_ids = array_map(
            function ($articles) {
                return $articles['id'];
            },
            $articles
        );

        $existing_articles = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT *
                FROM $assessments_articles_table
                WHERE assessment_id = %s",
                [$assessment_id]
            )
        );

        $existing_articles_ids = array_map(
            function ($existing_article) {
                return $existing_article->article_id;
            },
            $existing_articles
        );

        // Add new skill categories:
        foreach ($articles_ids as $article_id)
            if (!in_array($article_id, $existing_articles_ids))
                $wpdb->insert(
                    $assessments_articles_table,
                    [
                        'assessment_id' => $assessment_id,
                        'article_id' => $article_id
                    ]
                );

        // Remove unneeded skill categories:
        foreach ($existing_articles_ids as $existing_article_id)
            if (!in_array($existing_article_id, $articles_ids))
                $wpdb->delete(
                    $assessments_articles_table,
                    [
                        'assessment_id' => $assessment_id,
                        'article_id' => $existing_article_id
                    ]
                );
    }
}

if (!function_exists('insert_strategy')) {
    function insert_strategy($strategy, $user_id)
    {
        global $wpdb;
        $strategies_table = DB_PREFIX . 'strategies';
        $strategies_skill_categories_table  = DB_PREFIX . 'strategies_skill_categories';
        $strategies_targets_table = DB_PREFIX . 'strategies_targets';
        $targets_table = DB_PREFIX . 'targets';

        $current_strategy = $wpdb->get_row(
            "SELECT *
            FROM $strategies_table
            WHERE user_id = $user_id"
        );

        if ($current_strategy) {
            $strategy_targets = $wpdb->get_results(
                "SELECT *
                FROM $strategies_targets_table
                WHERE strategy_id = $current_strategy->id"
            );
            $strategy_targets_ids = array_map(function ($target) {
                return $target->target_id;
            }, $strategy_targets);

            $wpdb->query(
                "DELETE
                FROM $targets_table
                WHERE id IN (" . implode(",", $strategy_targets_ids) . ")"
            );
            $wpdb->delete($strategies_table, ["user_id" => $user_id]);
        }

        $wpdb->insert($strategies_table, [
            "user_id" => $user_id,
            "pilot_type" => $strategy["pilot_type"],
            "assessment_id" => array_key_exists('assessment_id', $strategy) ? $strategy["assessment_id"] : null,
            "assessor_id" =>  array_key_exists('assessor_id', $strategy) ? $strategy["assessor_id"] : null,
            "assessment_date" => date("Y-m-d", ($strategy['assessment_date'] / 1000)),
            "time_created" => date("Y-m-d H:i:s", time())
        ]);

        $strategy_id = $wpdb->insert_id;

        foreach ($strategy['skill_categories_ids'] as $skill_category_id) {
            $wpdb->insert(
                $strategies_skill_categories_table,
                [
                    "strategy_id" => $strategy_id,
                    "skill_category_id" => $skill_category_id
                ]
            );
        }

        return $strategy_id;
    }
}

if (!function_exists('insert_strategy_assessment_part')) {
    function insert_strategy_assessment_part($strategy_id, $strategy, $assessment_id, $user_id)
    {
        global $wpdb;
        $strategies_activities_table = DB_PREFIX . 'strategies_activities';
        $strategies_articles_table = DB_PREFIX . 'strategies_articles';
        $strategies_targets_table = DB_PREFIX . 'strategies_targets';
        $targets_table = DB_PREFIX . 'targets';
        $assessments_activities_table = DB_PREFIX . 'assessments_activities';
        $assessments_articles_table = DB_PREFIX . 'assessments_articles';
        $focus_activities_table = DB_PREFIX . 'focus_activities';
        $focus_articles_table = DB_PREFIX . 'focus_articles';

        $assessment_activities = $wpdb->get_results(
            "SELECT *
            FROM $assessments_activities_table
            WHERE assessment_id = $assessment_id"
        );
        $assessment_articles = $wpdb->get_results(
            "SELECT *
            FROM $assessments_articles_table
            WHERE assessment_id = $assessment_id
            AND difficulty !== 'null'"
        );

        $assessment_activities_ids = array_map(function ($assessment_activity) {
            return $assessment_activity->activity_id;
        }, $assessment_activities);
        $assessment_articles_ids = array_map(function ($assessment_article) {
            return $assessment_article->article_id;
        }, $assessment_articles);

        // $number_of_activities = random_int(3, 5);
        $number_of_activities = 15;

        shuffle($assessment_activities_ids);
        $final_activities_ids = count($assessment_activities_ids) > $number_of_activities ? array_slice($assessment_activities_ids, 0, $number_of_activities) : $assessment_activities_ids;

        foreach ($final_activities_ids as $activity_id) {
            $wpdb->insert(
                $strategies_activities_table,
                [
                    "strategy_id" => $strategy_id,
                    "activity_id" => $activity_id,
                    "type" => "prepare"
                ]
            );

            $activity_already_focused = ($wpdb->get_row(
                "SELECT *
                FROM $focus_activities_table
                WHERE user_id = $user_id
                AND activity_id = $activity_id"
            ) !== null);

            if (!$activity_already_focused) {
                $wpdb->insert(
                    $focus_activities_table,
                    [
                        "user_id" => $user_id,
                        "activity_id" => $activity_id
                    ]
                );
            }
        }

        $number_of_targets = min(count($final_activities_ids), 5);
        shuffle($assessment_activities_ids);
        $targets_activities_ids = count($assessment_activities_ids) > $number_of_targets ? array_slice($assessment_activities_ids, 0, $number_of_targets) : $assessment_activities_ids;

        foreach ($targets_activities_ids as $target_activity_id) {
            $wpdb->insert(
                $targets_table,
                [
                    "user_id" => $user_id,
                    "target_type" => "activity",
                    "target_id" => $target_activity_id,
                    "type" => "score",
                    "figure" => 75,
                    "start_time" => date("Y-m-d H:i:s", time()),
                    "end_time" => date("Y-m-d H:i:s", ($strategy['assessment_date'] / 1000))
                ]
            );

            $last_target_id = $wpdb->insert_id;
            $wpdb->insert($strategies_targets_table, [
                "strategy_id" => $strategy_id,
                "target_id" => $last_target_id,
                "type" => "prepare"
            ]);
        }

        // $number_of_articles = random_int(2, 3);
        $number_of_articles = 5;

        shuffle($assessment_articles_ids);
        $final_articles_ids = count($assessment_articles_ids) > $number_of_articles ? array_slice($assessment_articles_ids, 0, $number_of_articles) : $assessment_articles_ids;
        foreach ($final_articles_ids as $article_id) {
            $wpdb->insert(
                $strategies_articles_table,
                [
                    "strategy_id" => $strategy_id,
                    "article_id" => $article_id,
                    "type" => "prepare"
                ]
            );

            $article_already_focused = ($wpdb->get_row(
                "SELECT *
                FROM $focus_articles_table
                WHERE user_id = $user_id
                AND article_id = $article_id"
            ) !== null);

            if (!$article_already_focused) {
                $wpdb->insert(
                    $focus_articles_table,
                    [
                        "user_id" => $user_id,
                        "article_id" => $article_id
                    ]
                );
            }
        }
    }
}

if (!function_exists('insert_strategy_weakness_part')) {
    function insert_strategy_weakness_part($strategy_id, $strategy, $user_id)
    {
        global $wpdb;
        $strategies_activities_table = DB_PREFIX . 'strategies_activities';
        $strategies_articles_table = DB_PREFIX . 'strategies_articles';
        $strategies_targets_table = DB_PREFIX . 'strategies_targets';
        $activities_table = DB_PREFIX . 'activities';
        $activities_skill_categories_table = DB_PREFIX . 'activities_skill_categories';
        $targets_table = DB_PREFIX . 'targets';
        $articles_difficulties_table = DB_PREFIX . 'articles_difficulties';
        $focus_activities_table = DB_PREFIX . 'focus_activities';
        $focus_articles_table = DB_PREFIX . 'focus_articles';

        $skill_categories_ids = $strategy['skill_categories_ids'];

        $weakness_activities = $wpdb->get_results(
            "SELECT *
            FROM $activities_table
            JOIN $activities_skill_categories_table
            ON $activities_skill_categories_table.activity_id = $activities_table.id
            AND $activities_skill_categories_table.skill_category_id IN (" . implode(',', $skill_categories_ids) . ")"
        );
        $weakness_activities_ids = array_map(function ($activity) {
            return $activity->activity_id;
        }, $weakness_activities);

        $number_of_activities = random_int(3, 5);

        shuffle($weakness_activities_ids);
        $final_activities_ids = count($weakness_activities_ids) > $number_of_activities ? array_slice($weakness_activities_ids, 0, $number_of_activities) : $weakness_activities_ids;

        foreach ($final_activities_ids as $activity_id) {
            $wpdb->insert(
                $strategies_activities_table,
                [
                    "strategy_id" => $strategy_id,
                    "activity_id" => $activity_id,
                    "type" => "weakness"
                ]
            );

            $activity_already_focused = ($wpdb->get_row(
                "SELECT *
                FROM $focus_activities_table
                WHERE user_id = $user_id
                AND activity_id = $activity_id"
            ) !== null);

            if (!$activity_already_focused) {
                $wpdb->insert(
                    $focus_activities_table,
                    [
                        "user_id" => $user_id,
                        "activity_id" => $activity_id
                    ]
                );
            }
        }

        foreach ($skill_categories_ids as $skill_category_id) {
            $wpdb->insert(
                $targets_table,
                [
                    "user_id" => $user_id,
                    "target_type" => "skill",
                    "target_id" => $skill_category_id,
                    "type" => "improvement",
                    "figure" => (random_int(3, 6) * 5),
                    "start_time" => date("Y-m-d H:i:s", time()),
                    "end_time" => date("Y-m-d H:i:s", ($strategy['assessment_date'] / 1000))
                ]
            );

            $last_target_id = $wpdb->insert_id;
            $wpdb->insert($strategies_targets_table, [
                "strategy_id" => $strategy_id,
                "target_id" => $last_target_id,
                "type" => "weakness"
            ]);
        }

        if ($strategy['pilot_type'] === 'aspiring')
            $articles = $wpdb->get_results(
                "SELECT *
                FROM $articles_difficulties_table
                WHERE difficulty = 'aspiring'"
            );
        else if ($strategy['pilot_type'] === 'new')
            $articles = $wpdb->get_results(
                "SELECT *
                FROM $articles_difficulties_table
                WHERE difficulty = 'aspiring'
                OR difficulty = 'new'"
            );
        else if ($strategy['pilot_type'] === 'experienced')
            $articles = $wpdb->get_results(
                "SELECT *
                FROM $articles_difficulties_table
                WHERE difficulty = 'aspiring'
                OR difficulty = 'new'
                OR difficulty = 'experienced'"
            );

        $articles_ids = array_map(function ($article) {
            return $article->article_id;
        }, $articles);

        $number_of_articles = random_int(2, 3);

        shuffle($articles_ids);
        $final_acticles_ids = count($articles_ids) > $number_of_articles ? array_slice($articles_ids, 0, $number_of_articles) : $articles_ids;

        foreach ($final_acticles_ids as $article_id) {
            $wpdb->insert(
                $strategies_articles_table,
                [
                    "strategy_id" => $strategy_id,
                    "article_id" => $article_id,
                    "type" => "weakness"
                ]
            );

            $article_already_focused = ($wpdb->get_row(
                "SELECT *
                FROM $focus_articles_table
                WHERE user_id = $user_id
                AND article_id = $article_id"
            ) !== null);

            if (!$article_already_focused) {
                $wpdb->insert(
                    $focus_articles_table,
                    [
                        "user_id" => $user_id,
                        "article_id" => $article_id
                    ]
                );
            }
        }
    }
}

if (!function_exists('get_performance')) {
    function get_performance($current_user_id, $activity_id)
    {
        global $wpdb;
        $options_table = DB_PREFIX . 'options';
        $results_table = DB_PREFIX . 'results';
        $targets_table = DB_PREFIX . 'targets';

        if ($activity_id !== null) {
            $other_users_scores = $wpdb->get_col(
                "SELECT score
                FROM $results_table
                WHERE user_id != $current_user_id
                AND activity_id = $activity_id
                AND mode = 'normal'
                ORDER BY score ASC"
            );

            $user_results = $wpdb->get_results(
                "SELECT *
                FROM $results_table
                WHERE user_id = $current_user_id
                AND activity_id = $activity_id
                ORDER BY time DESC"
            );

            $user_activity_targets = $wpdb->get_results(
                "SELECT *
                FROM $targets_table
                WHERE user_id = $current_user_id
                AND target_type = 'activity'
                AND target_id = $activity_id"
            );
        } else {
            $other_users_scores = $wpdb->get_col(
                "SELECT score
                FROM $results_table
                WHERE user_id != $current_user_id
                AND mode = 'normal'
                ORDER BY score ASC"
            );

            $user_results = $wpdb->get_results(
                "SELECT *
                FROM $results_table
                WHERE user_id = $current_user_id
                ORDER BY time DESC"
            );

            $user_activity_targets = $wpdb->get_results(
                "SELECT *
                FROM $targets_table
                WHERE user_id = $current_user_id
                AND target_type = 'activity'"
            );
        }

        // Calculating score and median:

        $normal_user_results = array_filter($user_results, function ($result) {
            return $result->mode === 'normal';
        });

        $recent_user_scores = array_map(function ($result) {
            return $result->score;
        }, array_slice($normal_user_results, 0, min(3, count($normal_user_results))));
        $user_score = count($recent_user_scores) > 0 ? intval(array_sum($recent_user_scores) / count($recent_user_scores)) : null;

        $median = 'average';
        if ($user_score !== null && count($other_users_scores) >= 3) {
            $score_chunks = partition($other_users_scores, 3);

            $low_score = get_array_median($score_chunks[0]);
            $high_score = get_array_median($score_chunks[2]);

            if ($user_score <= $low_score) $median = 'below';
            else if ($user_score >= $high_score) $median = 'above';
        };

        $all_user_dates_scores = null;
        $scores_segments = null;
        $overall_improvement = null;
        $improvement_rate = null;
        $improvement_rate_speed = 'slow';
        $total_duration = null;
        $runs = null;
        $previous_days_scores = null;

        if (count($user_results) > 0) {
            $dates = [];
            foreach ($user_results as $result) {
                $key = date('d.m.Y', strtotime($result->time));

                if (isset($dates[$key])) array_push($dates[$key], $result->score);
                else $dates[$key] = [$result->score];
            }

            foreach ($dates as $i => $date) {
                $dates[$i] = intval(array_sum($dates[$i]) / count($dates[$i]));
            }

            $today = date('d.m.Y');

            $previous_days_scores = [];
            for ($i = 1; $i <= 14; $i++) {
                $current_date = date('d.m.Y',  strtotime("$today -$i day"));

                array_push($previous_days_scores, isset($dates[$current_date]) ? $dates[$current_date] : 0);
            }

            if (array_sum($previous_days_scores) === 0) $previous_days_scores = null;

            if (count($normal_user_results) >= 3) {
                $all_user_dates_scores = array_values($dates);

                $user_scores = array_map(function ($result) {
                    return $result->score;
                }, $normal_user_results);

                $first_scores = partition($user_scores, 3)[2];
                sort($first_scores);

                // echo json_encode($user_scores);
                // die();

                $first_scores_median = get_array_median($first_scores);

                $regression = get_regression_prediction(array_reverse($all_user_dates_scores), 14);

                $user_predicted_score = intval(min($regression['prediction'], 100));

                $scores_segments = [$first_scores_median, $user_score, $user_predicted_score];

                if (count($all_user_dates_scores) >= 2) {
                    $overall_improvement = $regression['d'];
                }

                $improvement_rate = $regression['m'];

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

                $improvement_rate_speed = $improvement_rate >= $fast_improvement_rate ? 'fast' : ($improvement_rate < $slow_improvement_rate ? 'slow' : 'medium');
            }

            $total_duration = array_reduce($user_results, function ($sum, $result) {
                return $sum + $result->duration;
            });

            $runs = count($user_results);
        }

        // Targets:

        $achieved_targets = count($user_activity_targets) > 0 ? array_reduce($user_activity_targets, function ($count, $target) {
            return $count + ($target->progress == 100 ? 1 : 0);
        }) : 0;

        $missed_targets = count($user_activity_targets) > 0 ? array_reduce($user_activity_targets, function ($count, $target) {
            $passed = strtotime($target->end_time) <= time();

            return $count + ($passed && $target->progress < 100 ? 1 : 0);
        }) : 0;

        $active_targets = count($user_activity_targets) > 0 ? count($user_activity_targets) - $achieved_targets - $missed_targets : 0;

        return [
            "score" => $user_score,
            "median" => $median,
            "all_scores" => $all_user_dates_scores,
            "scores_segments" => $scores_segments,
            "overall_improvement" => $overall_improvement,
            "improvement_rate" => $improvement_rate,
            "improvement_rate_speed" => $improvement_rate_speed,
            "total_duration" => $total_duration,
            "runs" => $runs,
            "previous_days_scores" => $previous_days_scores,
            "targets" => [
                "active" => $active_targets,
                "achieved" => $achieved_targets,
                "missed" => $missed_targets
            ]
        ];
    }
}

if (!function_exists('partition')) {
    function partition(array $list, $p)
    {
        if ($p <= 1) return $list;

        $listlen = count($list);
        $partlen = floor($listlen / $p);
        $partrem = $listlen % $p;
        $partition = array();
        $mark = 0;
        for ($px = 0; $px < $p; $px++) {
            $incr = ($px < $partrem) ? $partlen + 1 : $partlen;
            $partition[$px] = array_slice($list, $mark, $incr);
            $mark += $incr;
        }
        return $partition;
    }
}

if (!function_exists('get_array_median')) {
    function get_array_median(array $prev_arr)
    {
        if (count($prev_arr) === 0) return 0;

        $arr = $prev_arr;

        $count = count($arr);
        $middleval = floor(($count - 1) / 2);

        if ($count % 2)
            $median = $arr[$middleval];
        else {
            $low = $arr[$middleval];
            $high = $arr[$middleval + 1];
            $median = (($low + $high) / 2);
        }

        return $median;
    }
}

if (!function_exists('get_regression_prediction')) {
    function get_regression_prediction($arr, $offset)
    {
        if (count($arr) === 0) {
            return [
                "prediction" => 0,
                "m" => 0,
                "d" => 0
            ];
        } else if (count($arr) === 1) {
            return [
                "prediction" => 0,
                "m" => 0,
                "d" => $arr[0]
            ];
        }

        $n = count($arr);

        $sX = 0;
        for ($i = 1; $i <= $n; $i++) $sX += $i;

        $sY = array_sum($arr);

        $sXY = 0;
        for ($i = 1; $i <= $n; $i++) $sXY += $i * $arr[$i - 1];

        $sX2 = 0;
        for ($i = 1; $i <= $n; $i++) $sX2 += pow($i, 2);

        $m = ($n * $sXY - ($sX * $sY)) / ($n * $sX2 - pow($sX, 2));

        $b = ($sY - ($m * $sX)) / $n;

        $first_point_y = $m + $b;
        $last_point_y = $m * ($n - 1) + $b;

        return [
            "prediction" => $m * ($n + $offset) + $b,
            "m" => $m,
            "d" => (($last_point_y - $first_point_y) / $first_point_y) * 100
        ];
    }
}

if (!function_exists('safe_push')) {
    function safe_push(&$arr, $item)
    {
        if (isset($arr))
            array_push($arr, $item);
        else $arr = [$item];
    }
}
