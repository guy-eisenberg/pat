<?php

if (!class_exists('PAT_Exams')) {
    final class PAT_Exams
    {
        function __construct()
        {
        }

        public function create_db_tables()
        {
            global $wpdb;
            $users_table = $wpdb->prefix . 'users';

            $exams_table = DB_PREFIX . 'exams';
            $custom_content_table = DB_PREFIX . 'exams_custom_content';
            $categories_table = DB_PREFIX . 'exams_categories';
            $questions_table = DB_PREFIX . 'exams_questions';
            $answers_table = DB_PREFIX . 'exams_answers';
            $answers_informations_table = DB_PREFIX . 'exams_informations';
            $customizations_table = DB_PREFIX . 'exams_customizations';
            $customizations_disabled_categories_table = DB_PREFIX . 'exams_customizations_disabled_categories';

            $flagged_questions_table = DB_PREFIX . 'exams_flagged_questions';

            $exams_table_sql = "CREATE TABLE $exams_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                name VARCHAR(64) NOT NULL,
                question_quantity TINYINT UNSIGNED NOT NULL,
                show_results BOOLEAN NOT NULL,
                template_type ENUM('horizontal-images','horizontal-letters','horizontal-text','vertical-text') NOT NULL,
                allow_copilot BOOLEAN NOT NULL,
                customization_mode BOOLEAN NOT NULL,
                training_mode BOOLEAN NOT NULL,
                flag_questions BOOLEAN NOT NULL,
                exam_builder BOOLEAN NOT NULL,
                duration MEDIUMINT UNSIGNED NOT NULL,
                question_duration SMALLINT UNSIGNED NOT NULL,
                allow_user_navigation BOOLEAN NOT NULL,
                strong_pass SMALLINT UNSIGNED NULL,
                weak_pass SMALLINT UNSIGNED NULL,
                question_map BOOLEAN NOT NULL,
                max_questions SMALLINT UNSIGNED NULL,
                min_questions SMALLINT UNSIGNED NULL,
                random_answer_order BOOLEAN NOT NULL DEFAULT 1,
                hide_question_body_preview BOOLEAN NOT NULL DEFAULT 0,
                reduce_answer_option_size BOOLEAN NOT NULL DEFAULT 0,
                add_styling_to_images BOOLEAN NOT NULL DEFAULT 0,
                PRIMARY KEY id (id),
                KEY name (name)
            )";
            dbDelta($exams_table_sql);

            $custom_content_table_sql = "CREATE TABLE $custom_content_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                exam_id INT UNSIGNED NOT NULL UNIQUE,
                type ENUM('text','image','tabs') NOT NULL,
                content LONGTEXT NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY exam_id (exam_id) REFERENCES $exams_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                KEY type (type)
            )";
            dbDelta($custom_content_table_sql);

            $categories_table_sql = "CREATE TABLE $categories_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                exam_id INT UNSIGNED NOT NULL,
                parent_category_id INT UNSIGNED,
                name VARCHAR(64) NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY exam_id (exam_id) REFERENCES $exams_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY parent_category_id (parent_category_id) REFERENCES $categories_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                KEY name (name)
            )";
            dbDelta($categories_table_sql);

            $questions_table_sql = "CREATE TABLE $questions_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                category_id INT UNSIGNED NOT NULL,
                body TEXT NOT NULL,
                explanation TEXT NOT NULL,
                featured_image TEXT,
                PRIMARY KEY (id),
                FOREIGN KEY (category_id) REFERENCES $categories_table(id) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($questions_table_sql);

            $answers_table_sql = "CREATE TABLE $answers_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                question_id INT UNSIGNED NOT NULL,
                body TEXT NOT NULL,
                is_right BOOLEAN NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (question_id) REFERENCES $questions_table(id) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($answers_table_sql);

            $answers_informations_sql = "CREATE TABLE $answers_informations_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                question_id INT UNSIGNED NOT NULL,
                name VARCHAR(64) NOT NULL,
                type ENUM('hyperlink','image','pdf') NOT NULL,
                hyperlink TEXT NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY question_id (question_id) REFERENCES $questions_table(id) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($answers_informations_sql);

            $customizations_table_sql = "CREATE TABLE $customizations_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id BIGINT(20) UNSIGNED NOT NULL,
                exam_id INT UNSIGNED NOT NULL,
                name VARCHAR(64) NOT NULL,
                time_added DATETIME NOT NULL,
                duration MEDIUMINT UNSIGNED NOT NULL,
                question_quantity TINYINT UNSIGNED NOT NULL,
                copilot_activated BOOLEAN NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY user_id (user_id) REFERENCES $users_table(ID) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY exam_id (exam_id) REFERENCES $exams_table(id) ON UPDATE CASCADE,
                KEY name (name),
                KEY time_added (time_added)
            )";
            dbDelta($customizations_table_sql);

            $customizations_disabled_categories_table_sql = "CREATE TABLE $customizations_disabled_categories_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                customization_id INT UNSIGNED NOT NULL,
                category_id INT UNSIGNED NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY customization_id (customization_id) REFERENCES $customizations_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY category_id (category_id) REFERENCES $categories_table(id) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($customizations_disabled_categories_table_sql);


            $flagged_questions_table_sql = "CREATE TABLE $flagged_questions_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id BIGINT(20) UNSIGNED NOT NULL,
                exam_id INT UNSIGNED NOT NULL,
                question_id INT UNSIGNED NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY user_id (user_id) REFERENCES $users_table(ID) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY question_id (question_id) REFERENCES $questions_table(id) ON UPDATE CASCADE
            )";
            dbDelta($flagged_questions_table_sql);
        }

        public function create_admin_menu($parent_slug, $capability)
        {
            add_submenu_page(
                $parent_slug,
                'P.A.T - Exams',
                'Exams',
                $capability,
                'pat-exams',
                function () {
                    wp_enqueue_style('exams-admin-menu', PAT_PLUGIN_URL . '/templates/exams-admin-menu/dist/index.css?v=2');
                    wp_enqueue_script('exams-admin-menu', PAT_PLUGIN_URL . '/templates/exams-admin-menu/dist/index.js?v=3', [], '', true);

                    require(PAT_PLUGIN_DIR . 'templates/exams-admin-menu/exams-admin-menu.php');
                }
            );
        }

        public function registers()
        {
        }
    }
}
