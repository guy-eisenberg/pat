<?php

require_once __DIR__ . '/../init-auth.php';

require_once __DIR__ . '/../../../../../wp-load.php';

global $wpdb;

$id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

if ($id) {
    $answers_table = DB_PREFIX . 'exams_answers';

    $wpdb->delete($answers_table, ['id' => $id]);
}
