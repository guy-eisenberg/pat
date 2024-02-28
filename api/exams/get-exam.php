<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';
require_once 'functions.php';

global $wpdb;

$exam_id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

if ($exam_id && $exam_id !== 'custom') {
    $exams_table = DB_PREFIX . 'exams';

    $exam = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT * 
            FROM $exams_table 
            WHERE id = %s",
            [$exam_id]
        )
    );

    if ($exam) {
        $res = flat_exam($exam);

        echo json_encode($res);
    } else {
        http_response_code(404);
        die('Not Found');
    }
} else if ($exam_id === 'custom' && array_key_exists('questions', $_GET)) {
    $questions_ids = $_GET['questions'];

    $questions_table = DB_PREFIX . 'exams_questions';
    $categories_table = DB_PREFIX . 'exams_categories';

    $categories = $wpdb->get_results(
        "SELECT DISTINCT $categories_table.*
        FROM $questions_table
        JOIN $categories_table 
        ON $questions_table.id in ($questions_ids)
        AND $questions_table.category_id = $categories_table.id"
    );

    $questions = $wpdb->get_results(
        "SELECT *
        FROM $questions_table
        WHERE id in ($questions_ids)"
    );

    $flat_categories = array_map(function ($category) use ($questions) {
        $category_questions = array_filter($questions, function ($question) use ($category) {
            return $question->category_id === $category->id;
        });

        return [
            "id" => $category->id,
            "exam_id" => $category->exam_id,
            "parent_category_id" => null,
            "name" => $category->name,
            "questions" => array_map(function ($question) {
                return flat_question($question);
            }, $category_questions),
            "sub_categories" => []
        ];
    }, $categories);

    $exam = [
        "allow_copilot" => false,
        "allow_user_navigation" => true,
        "categories" => $flat_categories,
        "customization_mode" => false,
        "duration" => 600,
        "exam_builder" => false,
        "flag_questions" => true,
        "id" => "custom",
        "name" => "Custom Exam",
        "question_duration" => 15,
        "question_map" => true,
        "question_quantity" => count($questions),
        "show_results" => true,
        "strong_pass" => null,
        "template_type" => "side-by-side-medium",
        "training_mode" => true,
        "weak_pass" => null
    ];

    echo json_encode($exam);
}
