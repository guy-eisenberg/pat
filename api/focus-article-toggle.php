<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$focus_articles_table = DB_PREFIX . 'focus_articles';

$article_id = $_POST['article_id'];

$focused = $wpdb->get_row(
    "SELECT *
    FROM $focus_articles_table
    WHERE article_id = $article_id
    AND user_id = $current_user_id"
) !== null;

if ($focused) {
    $wpdb->delete($focus_articles_table, ['user_id' => $current_user_id, 'article_id' => $_POST['article_id']]);
    echo false;
} else {
    $wpdb->insert($focus_articles_table, ['user_id' => $current_user_id, 'article_id' => $_POST['article_id']]);
    echo true;
}
