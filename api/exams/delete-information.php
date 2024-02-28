<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';

global $wpdb;

$id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

if ($id) {
    $informations_table = DB_PREFIX . 'exams_informations';

    $wpdb->delete($informations_table, ['id' => $id]);
}
