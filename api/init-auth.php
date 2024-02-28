<?php

require_once __DIR__ . '/../../../../wp-load.php';

$current_user_id = 1;

if (!$current_user_id) {
    echo "Unauthorized";
    exit;
}


$current_activity_id = $_SESSION['current_activity_id'];
