<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

global $wpdb;
$options_table = DB_PREFIX . 'options';

$option_name = array_key_exists('option', $_GET) ? $_GET['option'] : null;

if ($option_name) {
    $option = $wpdb->get_row(
        "SELECT option_value
        FROM $options_table
        WHERE option_name='$option_name'"
    );

    echo $option->option_value;
}
