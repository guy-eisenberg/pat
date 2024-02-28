<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$focus_articles_table = DB_PREFIX . 'focus_articles';

$wpdb->delete($focus_articles_table, ["user_id" => $current_user_id]);
