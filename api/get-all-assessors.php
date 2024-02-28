<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$assessors_table = DB_PREFIX . 'assessors';
$assessments_table = DB_PREFIX . 'assessments';

$assessors = $wpdb->get_results(
    "SELECT * 
    FROM $assessors_table"
);

$flat_assessors = array_map(function ($assessor) use ($wpdb, $assessments_table) {
    $assessment = $wpdb->get_row(
        "SELECT *
        FROM $assessments_table
        WHERE id = $assessor->assessment_id"
    );

    return array_merge((array)$assessor, ["assessment" => $assessment]);
}, $assessors);

echo json_encode($flat_assessors);
