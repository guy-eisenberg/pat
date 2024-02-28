<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';
require_once 'functions.php';

global $wpdb;
$assessors_table = DB_PREFIX . 'assessors';

$json = file_get_contents('php://input');
$strategy = (array)json_decode($json, true);

if (
    array_key_exists('pilot_type', $strategy) &&
    (array_key_exists('assessment_id', $strategy) || array_key_exists('assessor_id', $strategy)) &&
    array_key_exists('assessment_date', $strategy) &&
    array_key_exists('skill_categories_ids', $strategy)
) {
    $strategy_id = insert_strategy($strategy, $current_user_id);

    if (array_key_exists('assessment_id', $strategy)) $focus_assessment_id = $strategy["assessment_id"];
    else {
        $assessor_id = $strategy['assessor_id'];
        $assessor = $wpdb->get_row(
            "SELECT *
            FROM $assessors_table
            WHERE id = $assessor_id"
        );

        $focus_assessment_id = $assessor->assessment_id;
    }

    insert_strategy_assessment_part($strategy_id, $strategy, $focus_assessment_id, $current_user_id);
    insert_strategy_weakness_part($strategy_id, $strategy, $current_user_id);
}
