<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

$user_meta = get_userdata($current_user_id);

echo json_encode([
    "first_name" => $user_meta->first_name,
    "last_name" => $user_meta->last_name
]);
