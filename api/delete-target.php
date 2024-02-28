<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

$target_id = $_GET['id'];

global $wpdb;
$targets_table = DB_PREFIX . 'targets';

$wpdb->delete($targets_table, ["user_id" => $current_user_id, "id" => $target_id]);
