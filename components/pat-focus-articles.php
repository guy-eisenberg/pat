<?php

if (!class_exists('PHP_Focus_Articles')) {
    final class PHP_Focus_Articles
    {
        function __construct()
        {
        }

        public function create_db_tables()
        {
            global $wpdb;
            $users_table = $wpdb->prefix . 'users';
            $posts_table = $wpdb->prefix . 'posts';

            $articles_difficulties_table = DB_PREFIX . 'articles_difficulties';
            $focus_articles_table = DB_PREFIX . 'focus_articles';

            $articles_difficulties_table_sql = "CREATE TABLE $articles_difficulties_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                article_id BIGINT(20) UNSIGNED NOT NULL UNIQUE,
                difficulty enum ('null','aspiring','new','experienced') NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY article_id (article_id) REFERENCES $posts_table(ID) ON DELETE CASCADE ON UPDATE CASCADE,
                KEY difficulty (difficulty)
            )";
            dbDelta($articles_difficulties_table_sql);

            $focus_articles_table_sql = "CREATE TABLE $focus_articles_table (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id BIGINT(20) UNSIGNED NOT NULL,
                article_id BIGINT(20) UNSIGNED NOT NULL,
                PRIMARY KEY id (id),
                FOREIGN KEY user_id (user_id) REFERENCES $users_table(ID) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY article_id (article_id) REFERENCES $posts_table(ID) ON DELETE CASCADE ON UPDATE CASCADE
            )";
            dbDelta($focus_articles_table_sql);
        }

        public function registers()
        {
            add_action('init', [$this, 'register_shortcodes']);
            add_action('add_meta_boxes', [$this, 'add_article_difficulty_meta_box']);
            add_action('save_post_post', [$this, 'update_article_difficulty_data']);

            add_filter('the_content', function ($content) {
                $post_type = get_post_type();

                if ($post_type === 'post') {
                    wp_enqueue_style('pat-focus-article-button', PAT_PLUGIN_URL . '/templates/focus-article-button/focus-article-button.css');

                    ob_start();
                    require PAT_PLUGIN_DIR . '/templates/focus-article-button/focus-article-button.php';

                    return ob_get_clean() . $content;
                }

                return $content;
            });
        }

        public function register_shortcodes()
        {
            add_action('wp_enqueue_scripts', function () {
                wp_enqueue_style('pat-focus-articles-list', PAT_PLUGIN_URL . '/templates/focus-articles-list/focus-articles-list.css');
            });
            add_shortcode('pat-focus-articles-list', function () {
                ob_start();
                require PAT_PLUGIN_DIR . '/templates/focus-articles-list/focus-articles-list.php';
                return ob_get_clean();
            });
        }

        public function add_article_difficulty_meta_box()
        {
            add_meta_box(
                "pat_article_difficulty_meta_box",
                "Difficulty",
                function ($post) {
                    global $wpdb;
                    $articles_difficulties_table = DB_PREFIX . 'articles_difficulties';

                    $value = $wpdb->get_row(
                        "SELECT *
                        FROM $articles_difficulties_table
                        WHERE article_id = $post->ID"
                    )->difficulty;

?>
                <div>
                    <input type="radio" name="difficulty" id="null" value="null" <?php
                                                                                    echo ($value === 'null' || $value === null) ? 'checked' : ''
                                                                                    ?>>
                    <label for="null">Not Applicable</label>
                </div>
                <br>
                <div>
                    <input type="radio" name="difficulty" id="aspiring" value="aspiring" <?php
                                                                                            echo ($value === 'aspiring') ? 'checked' : ''
                                                                                            ?>>
                    <label for="aspiring">Aspiring Pilot</label>
                </div>
                <br>
                <div>
                    <input type="radio" name="difficulty" id="new" value="new" <?php
                                                                                echo ($value === 'new') ? 'checked' : ''
                                                                                ?>>
                    <label for="new">New Pilot</label>
                </div>
                <br>
                <div>
                    <input type="radio" name="difficulty" id="experienced" value="experienced" <?php
                                                                                                echo ($value === 'experienced') ? 'checked' : ''
                                                                                                ?>>
                    <label for="experienced">Experienced Pilot</label>
                </div>
<?php
                },
                "post"
            );
        }

        public function update_article_difficulty_data($post_id)
        {
            if (defined('REST_REQUEST') && REST_REQUEST) return;

            $post_type = get_post_type($post_id);
            $post_status = get_post_status($post_id);

            if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id) || $post_type !== 'post' || $post_status !== 'publish') return;

            global $wpdb;
            $articles_difficulties_table = DB_PREFIX . 'articles_difficulties';

            $difficulty = array_key_exists('difficulty', $_POST) ? $_POST['difficulty'] : 'null';

            $wpdb->query(
                "INSERT INTO $articles_difficulties_table (article_id, difficulty)
                VALUES ($post_id, '$difficulty')
                ON DUPLICATE KEY UPDATE difficulty='$difficulty'"
            );
        }
    }
}

if (!function_exists('user_focused_articles_count')) {
    function user_focused_articles_count()
    {
        $current_user_id = get_current_user_id();

        global $wpdb;
        $focus_articles_table = DB_PREFIX . 'focus_articles';

        $rows = $wpdb->get_results(
            "SELECT *
            FROM $focus_articles_table
            WHERE user_id = $current_user_id"
        );

        return count($rows);
    }
}
