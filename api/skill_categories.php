<?php

require_once './init-auth.php';

if (!function_exists('replace_skill_category')) {
    function replace_skill_category($skill_category)
    {

        $skill_categories_table = DB_PREFIX . 'skill_categories';

        $skill_category_id = replace($skill_categories_table, $skill_category);

        return $skill_category_id;
    }
}

require_once __DIR__ . '/../../../../wp-load.php';
require_once 'functions.php';

global $wpdb;
$skill_categories_table = DB_PREFIX . 'skill_categories';

$skill_category_id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

$res = null;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $res = $wpdb->get_results(
        "SELECT * 
        FROM $skill_categories_table
        ORDER BY id ASC"
    );
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');

    $params = json_decode($json, true);

    if (array_key_exists('skill_category', $params))
        $res = replace_skill_category($params['skill_category']);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if ($skill_category_id)
        $wpdb->delete($skill_categories_table, ['id' => $skill_category_id]);
}

echo json_encode($res);
