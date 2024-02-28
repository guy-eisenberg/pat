<?php

/**
 * Plugin Name: P.A.T
 * Description: All elements and functionality required for PilotAptitudeTest.
 * Version:     1.0
 * Author:      Guy Eisenberg
 * Author URI:  https://guyeisenberg.com
 */

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    exit();
}

if (!defined('PAT_PLUGIN_URL'))
    define('PAT_PLUGIN_URL', plugin_dir_url(__FILE__));
if (!defined('PAT_PLUGIN_DIR'))
    define('PAT_PLUGIN_DIR', plugin_dir_path(__FILE__));

require_once(ABSPATH . 'wp-load.php');
require_once(PAT_PLUGIN_DIR . 'components/pat-exams.php');
require_once(PAT_PLUGIN_DIR . 'components/pat-focus-articles.php');
require_once(PAT_PLUGIN_DIR . 'widgets/pat-activities-sidebar.php');
require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

global $wpdb;

if (!defined('DB_PREFIX'))
    define('DB_PREFIX', $wpdb->prefix . 'pat_');

if (!class_exists('PAT')) {
    final class PAT
    {
        private $exams;
        private $focus_articles;

        function __construct()
        {
            $this->exams = new PAT_Exams();
            $this->focus_articles = new PHP_Focus_Articles();

            $this->registers();

            if (session_status() === PHP_SESSION_NONE)
                session_start();
        }

        public function activate()
        {
            $this->create_db_tables();

            $this->exams->create_db_tables();
            $this->focus_articles->create_db_tables();
        }


        public function registers()
        {
            register_activation_hook(__FILE__, [$this, 'activate']);

            add_action('admin_menu', [$this, 'create_admin_menus']);
            add_action('init', [$this, 'register_shortcodes']);

            $this->create_widgets();
            $this->exams->registers();
            $this->focus_articles->registers();
        }

        public function register_shortcodes()
        {
            add_shortcode('pat-targets-dashboard', function () {
                wp_enqueue_style('pat-targets-dashboard', PAT_PLUGIN_URL . '/templates/targets-dashboard/dist/index.css');
                wp_enqueue_script('pat-targets-dashboard', PAT_PLUGIN_URL . '/templates/targets-dashboard/dist/index.js');

                ob_start();
                require __DIR__ . '/templates/targets-dashboard/targets-dashboard.php';
                return ob_get_clean();
            });

            add_shortcode('pat-flagged-questions-dashboard', function () {
                wp_enqueue_style('pat-flagged-questions-dashboard', PAT_PLUGIN_URL . '/templates/flagged-questions-dashboard/dist/index.css');
                wp_enqueue_script('pat-flagged-questions-dashboard', PAT_PLUGIN_URL . '/templates/flagged-questions-dashboard/dist/index.js');

                ob_start();
                require __DIR__ . '/templates/flagged-questions-dashboard/flagged-questions-dashboard.php';
                return ob_get_clean();
            });

            add_shortcode('pat-planner-dashboard', function () {
                wp_enqueue_style('pat-planner-dashboard', PAT_PLUGIN_URL . '/templates/planner-dashboard/dist/index.css');
                wp_enqueue_script('pat-planner-dashboard', PAT_PLUGIN_URL . '/templates/planner-dashboard/dist/index.js');

                ob_start();
                require __DIR__ . '/templates/planner-dashboard/planner-dashboard.php';
                return ob_get_clean();
            });

            add_shortcode('pat-preparation-strategy-dashboard', function () {
                wp_enqueue_style('pat-preparation-strategy-dashboard', PAT_PLUGIN_URL . '/templates/preparation-strategy-dashboard/dist/index.css');
                wp_enqueue_script('pat-preparation-strategy-dashboard', PAT_PLUGIN_URL . '/templates/preparation-strategy-dashboard/dist/index.js');

                ob_start();
                require __DIR__ . '/templates/preparation-strategy-dashboard/preparation-strategy-dashboard.php';
                return ob_get_clean();
            });

            // add_shortcode('pat-activities-sidebar', function () {
            //     wp_enqueue_style('pat-performance', PAT_PLUGIN_URL . '/templates/performance/dist/index.css');
            //     wp_enqueue_script('pat-performance', PAT_PLUGIN_URL . '/templates/performance/dist/index.js');

            //     ob_start();
            //     require __DIR__ . '/templates/performance/activities-sidebar.php';
            //     return ob_get_clean();
            // });

            add_shortcode('pat-activity-performance', function ($atts) {
                wp_enqueue_style('pat-performance', PAT_PLUGIN_URL . '/templates/performance/dist/index.css');
                wp_enqueue_script('pat-performance', PAT_PLUGIN_URL . '/templates/performance/dist/index.js');

                ob_start();
                require __DIR__ . '/templates/performance/activity-performance.php';
                return ob_get_clean();
            });

            add_shortcode('pat-dashboard', function () {
                wp_enqueue_style('pat-performance', PAT_PLUGIN_URL . '/templates/performance/dist/index.css');
                wp_enqueue_script('pat-performance', PAT_PLUGIN_URL . '/templates/performance/dist/index.js');

                ob_start();
                require __DIR__ . '/templates/performance/dashboard.php';
                return ob_get_clean();
            });

            add_shortcode('pat-performance', function () {
                wp_enqueue_style('pat-performance', PAT_PLUGIN_URL . '/templates/performance/dist/index.css');
                wp_enqueue_script('pat-performance', PAT_PLUGIN_URL . '/templates/performance/dist/index.js');

                ob_start();
                require __DIR__ . '/templates/performance/performance.php';
                return ob_get_clean();
            });

            add_action('wp_enqueue_scripts', function () {
                wp_enqueue_style('pat-activity-box', PAT_PLUGIN_URL . '/templates/activity-box/activity-box.css');
            });
            add_shortcode('pat-activity-box', function ($atts) {
                ob_start();
                require __DIR__ . '/templates/activity-box/activity-box.php';
                return ob_get_clean();
            });

            add_action('wp_enqueue_scripts', function () {
                wp_enqueue_style('pat-launch-activity', PAT_PLUGIN_URL . '/templates/launch-activity/launch-activity.css');
            });
            add_shortcode('pat-launch-activity', function ($atts) {
                ob_start();
                require __DIR__ . '/templates/launch-activity/launch-activity.php';
                return ob_get_clean();
            });

            add_action('wp_enqueue_scripts', function () {
                wp_enqueue_style('pat-focus-activities-list', PAT_PLUGIN_URL . '/templates/focus-activities-list/focus-activities-list.css');
            });
            add_shortcode('pat-focus-activities-list', function () {
                ob_start();
                require __DIR__ . '/templates/focus-activities-list/focus-activities-list.php';
                return ob_get_clean();
            });
        }

        public function create_widgets()
        {
            new PAT_Activities_Sidebar();
        }

        public function create_admin_menus()
        {
            $slug = 'pat';
            $capability = 'manage_options';

            add_menu_page(
                'PilotAptitudeTest',
                'P.A.T',
                $capability,
                $slug,
                null,
                'dashicons-airplane'
            );

            // add_submenu_page(
            //     $slug,
            //     'P.A.T - Skill Categories',
            //     'Skill Categories',
            //     $capability,
            //     $slug,
            //     function () {
            //         wp_enqueue_style('skill-categories-admin-menu', PAT_PLUGIN_URL . 'templates/skill-categories-admin-menu/dist/index.css');
            //         wp_enqueue_script('skill-categories-admin-menu', PAT_PLUGIN_URL . 'templates/skill-categories-admin-menu/dist/index.js', [], '', true);

            //         require(PAT_PLUGIN_DIR . 'templates/skill-categories-admin-menu/skill-categories-admin-menu.php');
            //     }
            // );

            add_submenu_page($slug, 'P.A.T - Activities', 'Activities', $capability, $slug, function () {
                wp_enqueue_style('activities-admin-menu', PAT_PLUGIN_URL . 'templates/activities-admin-menu/dist/index.css');
                wp_enqueue_script('activities-admin-menu', PAT_PLUGIN_URL . 'templates/activities-admin-menu/dist/index.js');

                require(PAT_PLUGIN_DIR . 'templates/activities-admin-menu/activities-admin-menu.php');
            });

            add_submenu_page($slug, 'P.A.T - Assessments', 'Assessments', $capability, 'pat-assessments', function () {
                wp_enqueue_style('assessments-admin-menu', PAT_PLUGIN_URL . 'templates/assessments-admin-menu/dist/index.css');
                wp_enqueue_script('assessments-admin-menu', PAT_PLUGIN_URL . 'templates/assessments-admin-menu/dist/index.js');

                require(PAT_PLUGIN_DIR . 'templates/assessments-admin-menu/assessments-admin-menu.php');
            });

            add_submenu_page($slug, 'P.A.T - Assessors', 'Assessors', $capability, 'pat-assessors', function () {
                wp_enqueue_style('assessors-admin-menu', PAT_PLUGIN_URL . 'templates/assessors-admin-menu/dist/index.css');
                wp_enqueue_script('assessors-admin-menu', PAT_PLUGIN_URL . 'templates/assessors-admin-menu/dist/index.js');

                require(PAT_PLUGIN_DIR . 'templates/assessors-admin-menu/assessors-admin-menu.php');
            });

            $this->exams->create_admin_menu($slug, $capability);
        }

        private function create_db_tables()
        {
            global $wpdb;
            $users_table = $wpdb->prefix . 'users';
            $posts_table = $wpdb->prefix . 'posts';

            $options_table = DB_PREFIX . 'options';

            $activities_table = DB_PREFIX . 'activities';
            $activities_last_use_table = DB_PREFIX . 'activities_last_use';
            $focus_activities_table = DB_PREFIX . 'focus_activities';
            $results_table = DB_PREFIX . 'results';
            $targets_table = DB_PREFIX . 'targets';
            $skill_categories_table = DB_PREFIX . 'skill_categories';
            $activities_skill_categories_table = DB_PREFIX . 'activities_skill_categories';
            $strategies_table = DB_PREFIX . 'strategies';
            $strategies_skill_categories_table = DB_PREFIX . 'strategies_skill_categories';
            $strategies_targets_table = DB_PREFIX . 'strategies_targets';
            $strategies_activities_table = DB_PREFIX . 'strategies_activities';
            $strategies_articles_table = DB_PREFIX . 'strategies_articles';
            $assessments_table = DB_PREFIX . 'assessments';
            $assessments_activities_table = DB_PREFIX . 'assessments_activities';
            $assessments_articles_table = DB_PREFIX . 'assessments_articles';
            $assessors_table = DB_PREFIX . 'assessors';

            $options_table_sql = "CREATE TABLE $options_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                option_name VARCHAR(128) NOT NULL UNIQUE,
                option_value LONGTEXT NOT NULL,
                PRIMARY KEY id (id)
            )";
            dbDelta($options_table_sql);

            $activities_table_sql = "CREATE TABLE $activities_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                slug VARCHAR(64) NOT NULL UNIQUE,
                name VARCHAR(64) NOT NULL,
                short_name VARCHAR(64),
                legacy BOOLEAN NOT NULL DEFAULT 0,
                page_hyperlink VARCHAR(255) NOT NULL,
                run_hyperlink VARCHAR(255) NOT NULL,
                help_hyperlink VARCHAR(255) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                PRIMARY KEY id (id),
                KEY name (name),
                KEY short_name (short_name),
                KEY legacy (legacy)
            )";
            dbDelta($activities_table_sql);

            $activities_last_use_sql = "CREATE TABLE $activities_last_use_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id BIGINT(20) UNSIGNED NOT NULL,
                activity_id INT UNSIGNED NOT NULL,
                time DATETIME NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY user_id (user_id) REFERENCES $users_table(ID) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY activity_id (activity_id) REFERENCES $activities_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                KEY time (time)
           )";
            dbDelta($activities_last_use_sql);

            $focus_activities_table_sql = "CREATE TABLE $focus_activities_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id BIGINT(20) UNSIGNED NOT NULL,
                activity_id INT UNSIGNED NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY user_id (user_id) REFERENCES $users_table(ID) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY activity_id (activity_id) REFERENCES $activities_table(id) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($focus_activities_table_sql);

            $results_table_sql = "CREATE TABLE $results_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id BIGINT(20) UNSIGNED NOT NULL,
                activity_id INT UNSIGNED NOT NULL,
                score SMALLINT UNSIGNED NULL,
                duration SMALLINT UNSIGNED NOT NULL,
                mode ENUM('normal','training') NOT NULL,
                time DATETIME NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY user_id (user_id) REFERENCES $users_table(ID) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY activity_id (activity_id) REFERENCES $activities_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                KEY score (score),
                KEY duration (duration),
                KEY mode (mode),
                KEY time (time)
            )";
            dbDelta($results_table_sql);

            $targets_table_sql = "CREATE TABLE $targets_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id BIGINT(20) UNSIGNED NOT NULL,
                target_type ENUM ('activity','skill') NOT NULL,
                target_id INT UNSIGNED NOT NULL,
                type ENUM ('time','score','improvement') NOT NULL,
                figure SMALLINT UNSIGNED NOT NULL,
                progress FLOAT UNSIGNED NOT NULL DEFAULT 0,
                start_time DATETIME NOT NULL,
                end_time DATETIME NOT NULL,
                achieve_time DATETIME,
                PRIMARY KEY id (id),
                FOREIGN KEY user_id (user_id) REFERENCES $users_table(ID) ON DELETE CASCADE ON UPDATE CASCADE,
                KEY target_type (target_type),
                KEY target_id (target_id),
                KEY type (type),
                KEY figure (figure),
                KEY progress (progress),
                KEY start_time (start_time),
                KEY end_time (end_time),
                KEY achieve_time (achieve_time)
            )";
            dbDelta($targets_table_sql);

            $skill_categories_table_sql = "CREATE TABLE $skill_categories_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                name VARCHAR(64) NOT NULL,
                icon TEXT NOT NULL,
                PRIMARY KEY id (id),
                KEY name (name)
            )";
            dbDelta($skill_categories_table_sql);

            $activities_skill_categories_table_sql = "CREATE TABLE $activities_skill_categories_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                activity_id INT UNSIGNED NOT NULL,
                skill_category_id INT UNSIGNED NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY activity_id (activity_id) REFERENCES $activities_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY skill_category_id (skill_category_id) REFERENCES $skill_categories_table(id) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($activities_skill_categories_table_sql);

            $assessments_table_sql = "CREATE TABLE $assessments_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                PRIMARY KEY id (id),
                KEY name (name)
            )";
            dbDelta($assessments_table_sql);

            $assessments_activities_table_sql = "CREATE TABLE $assessments_activities_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                assessment_id INT UNSIGNED NOT NULL,
                activity_id INT UNSIGNED NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY assessment_id (assessment_id) REFERENCES $assessments_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY activity_id (activity_id) REFERENCES $activities_table(id) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($assessments_activities_table_sql);

            $assessments_articles_table_sql = "CREATE TABLE $assessments_articles_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                assessment_id INT UNSIGNED NOT NULL,
                article_id BIGINT(20) UNSIGNED NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY assessment_id (assessment_id) REFERENCES $assessments_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY article_id (article_id) REFERENCES $posts_table(ID) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($assessments_articles_table_sql);

            $assessors_table_sql = "CREATE TABLE $assessors_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                type ENUM('school','airline') NOT NULL,
                assessment_id INT UNSIGNED NOT NULL,
                color VARCHAR(7) NOT NULL,
                image TEXT,
                PRIMARY KEY id (id),
                KEY name (name),
                KEY type (type),
                FOREIGN KEY assessment_id (assessment_id) REFERENCES $assessments_table(id) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($assessors_table_sql);

            $strategies_table_sql = "CREATE TABLE $strategies_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id BIGINT(20) UNSIGNED NOT NULL,
                pilot_type ENUM ('aspiring','new','experienced') NOT NULL,
                assessment_id INT UNSIGNED,
                assessor_id INT UNSIGNED,
                assessment_date DATE NOT NULL,
                time_created DATETIME NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY user_id (user_id) REFERENCES $users_table(ID) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY assessment_id (assessment_id) REFERENCES $assessments_table(id) ON UPDATE CASCADE,
                FOREIGN KEY assessor_id (assessor_id) REFERENCES $assessors_table(id) ON UPDATE CASCADE
            )";
            dbDelta($strategies_table_sql);

            $strategies_skill_categories_table_sql = "CREATE TABLE $strategies_skill_categories_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                strategy_id INT UNSIGNED NOT NULL,
                skill_category_id INT UNSIGNED NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY strategy_id (strategy_id) REFERENCES $strategies_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY skill_category_id (skill_category_id) REFERENCES $skill_categories_table(id) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($strategies_skill_categories_table_sql);

            $strategies_targets_table_sql = "CREATE TABLE $strategies_targets_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                strategy_id INT UNSIGNED NOT NULL,
                target_id INT UNSIGNED NOT NULL,
                type ENUM ('prepare','weakness') NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY strategy_id (strategy_id) REFERENCES $strategies_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY target_id (target_id) REFERENCES $targets_table(id) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($strategies_targets_table_sql);

            $strategies_activities_table_sql = "CREATE TABLE $strategies_activities_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                strategy_id INT UNSIGNED NOT NULL,
                activity_id INT UNSIGNED NOT NULL,
                type ENUM ('prepare','weakness') NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY strategy_id (strategy_id) REFERENCES $strategies_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY activity_id (activity_id) REFERENCES $activities_table(id) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($strategies_activities_table_sql);

            $strategies_articles_table_sql = "CREATE TABLE $strategies_articles_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                strategy_id INT UNSIGNED NOT NULL,
                article_id BIGINT(20) UNSIGNED NOT NULL,
                type ENUM ('prepare','weakness') NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY strategy_id (strategy_id) REFERENCES $strategies_table(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY article_id (article_id) REFERENCES $posts_table(ID) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($strategies_articles_table_sql);
        }
    }
}

$core = new PAT();
