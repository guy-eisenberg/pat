<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;

$assessment_id = array_key_exists('id', $_GET) ? $_GET['id'] : null;

if ($assessment_id !== null) {
    $assessments_table = DB_PREFIX . 'assessments';

    $wpdb->delete($assessments_table, ['id' => $assessment_id]);
}
