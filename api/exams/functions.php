<?php

require_once __DIR__ . '/../../../../../wp-load.php';
require_once __DIR__ . '/../functions.php';

if (!function_exists('flat_exam')) {
    function flat_exam($exam)
    {
        global $wpdb;

        $exam_id = $exam->id;

        $categories_table = DB_PREFIX . 'exams_categories';
        $custom_content_table = DB_PREFIX . 'exams_custom_content';

        $categories = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * 
                FROM $categories_table
                WHERE exam_id = %s
                AND parent_category_id IS NULL",
                [$exam_id]
            )
        );
        $custom_content = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT *
                FROM $custom_content_table
                WHERE exam_id = %s",
                [$exam_id]
            )
        );

        return array_merge(
            (array) $exam,
            [
                "categories" => array_map(
                    function ($category) {
                        return flat_category($category);
                    },
                    $categories
                ),
                "custom_content" => $custom_content
            ]
        );
    }
}

if (!function_exists('flat_category')) {
    function flat_category($category)
    {
        global $wpdb;

        $category_id = $category->id;

        $categories_table = DB_PREFIX . 'exams_categories';
        $questions_table = DB_PREFIX . 'exams_questions';

        $sub_categories = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * 
                FROM $categories_table
                WHERE parent_category_id = %s",
                [$category_id]
            )
        );
        $questions = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * 
                FROM $questions_table
                WHERE category_id = %s",
                [$category_id]
            )
        );

        return array_merge((array)$category, [
            "sub_categories" => array_map(function ($category) {
                return flat_category($category);
            }, $sub_categories),
            "questions" => array_map(function ($question) {
                return flat_question($question);
            }, $questions)
        ]);
    }
}

if (!function_exists('flat_question')) {
    function flat_question($question)
    {
        global $wpdb;

        $question_id = $question->id;

        $answers_table = DB_PREFIX . 'exams_answers';
        $informations_table = DB_PREFIX . 'exams_informations';

        $answers = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * 
                FROM $answers_table
                WHERE question_id = %s",
                [$question_id]
            )
        );
        $informations = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * 
                FROM $informations_table
                WHERE question_id = %s",
                [$question_id]
            )
        );

        return array_merge((array)$question, [
            "answers" => $answers,
            "informations" => $informations
        ]);
    }
}

if (!function_exists('flat_customization')) {
    function flat_customization($customization)
    {
        global $wpdb;
        $disabled_categories_table = DB_PREFIX . 'exams_customizations_disabled_categories';

        $customization_id = $customization->id;

        $disabled_categories = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT *
                FROM $disabled_categories_table
                WHERE customization_id = %s",
                [$customization_id]
            )
        );

        $disabled_categories_ids = array_map(function ($disabled_category) {
            return $disabled_category->category_id;
        }, $disabled_categories);

        return array_merge((array) $customization, [
            "disabled_categories" => $disabled_categories_ids
        ]);
    }
}

if (!function_exists('replace_exam')) {
    function replace_exam($exam)
    {
        global $wpdb;

        $exams_table = DB_PREFIX . 'exams';
        $custom_content_table = DB_PREFIX . 'exams_custom_content';

        $exam_data = $exam;
        unset($exam_data['categories']);
        unset($exam_data['custom_content']);

        $exam_id = replace(
            $exams_table,
            $exam_data
        );

        foreach ($exam['categories'] as $category)
            replace_category($category, $exam_id);

        if (array_key_exists('custom_content', $exam))
            replace($custom_content_table, array_merge($exam['custom_content'], ['id' => $exam['custom_content']['id'], 'exam_id' => $exam_id]));
        else
            $wpdb->delete($custom_content_table, ['exam_id' => $exam_id]);


        return $exam_id;
    }
}

if (!function_exists('replace_category')) {
    function replace_category($category, $exam_id, $parent_category_id = null)
    {
        $categories_table = DB_PREFIX . 'exams_categories';

        $category_data = $category;
        unset($category_data['sub_categories']);
        unset($category_data['questions']);

        $category_id = replace(
            $categories_table,
            array_merge(
                (array) $category_data,
                [
                    'exam_id' => $exam_id,
                    'parent_category_id' => $parent_category_id
                ]
            )
        );

        foreach ($category['sub_categories'] as $sub_category)
            replace_category($sub_category, $exam_id, $category_id);
        foreach ($category['questions'] as $question)
            replace_question($question, $category_id);

        return $category_id;
    }
}

if (!function_exists('replace_question')) {
    function replace_question($question, $category_id)
    {
        $questions_table = DB_PREFIX . 'exams_questions';

        $question_data = $question;
        unset($question_data['answers']);
        unset($question_data['informations']);

        $question_id = replace(
            $questions_table,
            array_merge(
                (array) $question_data,
                [
                    'category_id' => $category_id
                ]
            )
        );

        foreach ($question['answers'] as $answer)
            replace_answer($answer, $question_id);
        foreach ($question['informations'] as $information)
            replace_information($information, $question_id);

        return $question_id;
    }
}

if (!function_exists('replace_answer')) {
    function replace_answer($answer, $question_id)
    {
        $answers_table = DB_PREFIX . 'exams_answers';

        $answer_id = replace(
            $answers_table,
            array_merge(
                (array) $answer,
                [
                    'question_id' => $question_id
                ]
            )
        );

        return $answer_id;
    }
}

if (!function_exists('replace_information')) {
    function replace_information($information, $question_id)
    {
        $informations_table = DB_PREFIX . 'exams_informations';

        $information_id = replace(
            $informations_table,
            array_merge(
                (array) $information,
                [
                    'question_id' => $question_id
                ]
            )
        );

        return $information_id;
    }
}

if (!function_exists('replace_customization')) {
    function replace_customization($customization, $user_id)
    {
        $customizations_table = DB_PREFIX . 'exams_customizations';

        $customization_data = $customization;
        unset($customization_data['disabled_categories']);

        $customization_id = replace(
            $customizations_table,
            array_merge(
                (array) $customization_data,
                [
                    'user_id' => $user_id
                ]
            )
        );

        insert_disabled_categories($customization_id, $customization['disabled_categories']);

        return $customization_id;
    }
}

if (!function_exists('insert_disabled_categories')) {
    function insert_disabled_categories($customization_id, $disabled_categories)
    {
        global $wpdb;
        $disabled_categories_table = DB_PREFIX . 'exams_customizations_disabled_categories';

        $existing_disabled_categories = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT *
                FROM $disabled_categories_table
                WHERE customization_id = %s",
                [$customization_id]
            )
        );
        $existing_disabled_categories_ids = array_map(function ($existing_disabled_category) {
            return $existing_disabled_category->category_id;
        }, $existing_disabled_categories);

        //  Add new disabled categories:
        foreach ($disabled_categories as $disabled_category_id)
            if (!in_array($disabled_category_id, $existing_disabled_categories_ids))
                $wpdb->insert(
                    $disabled_categories_table,
                    [
                        'customization_id' => $customization_id,
                        'category_id' => $disabled_category_id
                    ]
                );

        //  Remove unneeded disabled categories:
        foreach ($existing_disabled_categories_ids as $existing_disabled_category_id)
            if (!in_array($existing_disabled_category_id, $disabled_categories))
                $wpdb->delete(
                    $disabled_categories_table,
                    [
                        'customization_id' => $customization_id,
                        'category_id' => $existing_disabled_category_id
                    ]
                );
    }
}

// if (!function_exists('insert_skill_categories')) {
//     function insert_skill_categories($exam_id, $skill_categories)
//     {
//         global $wpdb;
//         $skill_categories_table = DB_PREFIX . 'activities_skill_categories';

//         $skill_categories_ids = array_map(
//             function ($category) {
//                 return $category['id'];
//             },
//             $skill_categories
//         );

//         $existing_skill_categories = $wpdb->get_results(
//             $wpdb->prepare(
//                 "SELECT *
//                 FROM $skill_categories_table
//                 WHERE activity_id = %s",
//                 [$exam_id]
//             )
//         );

//         $existing_skill_categories_ids = array_map(
//             function ($existing_skill_category) {
//                 return $existing_skill_category->skill_category_id;
//             },
//             $existing_skill_categories
//         );

//         // Add new skill categories:
//         foreach ($skill_categories_ids as $skill_category_id)
//             if (!in_array($skill_category_id, $existing_skill_categories_ids))
//                 $wpdb->insert(
//                     $skill_categories_table,
//                     [
//                         'exam_id' => $exam_id,
//                         'skill_category_id' => $skill_category_id
//                     ]
//                 );

//         // Remove unneeded skill categories:
//         foreach ($existing_skill_categories_ids as $existing_skill_category_id)
//             if (!in_array($existing_skill_category_id, $skill_categories_ids))
//                 $wpdb->delete(
//                     $skill_categories_table,
//                     [
//                         'exam_id' => $exam_id,
//                         'skill_category_id' => $existing_skill_category_id
//                     ]
//                 );
//     }
// }
