<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';

global $wpdb;

$category_id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

if ($category_id) {
    $categories_table = DB_PREFIX . 'exams_categories';

    $wpdb->delete($categories_table, ['id' => $category_id]);
}
