<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;

$assessor_id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

if ($assessor_id) {
    $assessors_table = DB_PREFIX . 'assessors';

    $wpdb->delete($assessors_table, ['id' => $assessor_id]);
}
