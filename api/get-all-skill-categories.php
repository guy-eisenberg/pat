<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$skill_categories_table = DB_PREFIX . 'skill_categories';

$res = $wpdb->get_results(
    "SELECT * 
    FROM $skill_categories_table"
);

echo json_encode($res);
