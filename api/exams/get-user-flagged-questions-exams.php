<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';
require_once 'functions.php';

global $wpdb;
$flagged_questions_table = DB_PREFIX . 'exams_flagged_questions';
$questions_table = DB_PREFIX . 'exams_questions';
$categories_table = DB_PREFIX . 'exams_categories';
$exams_table = DB_PREFIX . 'exams';

$exams_with_flagged_questions = $wpdb->get_results(
    "SELECT DISTINCT $exams_table.*
    FROM $flagged_questions_table
    JOIN $questions_table 
    ON $flagged_questions_table.user_id = $current_user_id AND $flagged_questions_table.question_id = $questions_table.id 
    JOIN $categories_table
    ON $questions_table.category_id = $categories_table.id
    JOIN $exams_table
    ON $categories_table.exam_id = $exams_table.id
    "
);

$flat_exams = array_map(function ($exam) {
    return flat_exam($exam);
}, $exams_with_flagged_questions);

$flagged_questions = $wpdb->get_results(
    "SELECT *
    FROM $flagged_questions_table
    WHERE user_id = $current_user_id"
);

$flat_flagged_questions_ids = array_map(function ($flagged_question) {
    return $flagged_question->question_id;
}, $flagged_questions);

echo json_encode(['exams' => $flat_exams, 'flagged_questions_ids' => $flat_flagged_questions_ids]);
