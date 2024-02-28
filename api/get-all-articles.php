<?php

require_once './init-auth.php';

require_once __DIR__ . '/../../../../wp-load.php';

$posts = [];

$args = [
    "post_type" => "post",
    "orderby" => "ID",
    "post_status" => "publish",
    "order" => "DESC",
    "posts_per_page" => -1
];
$query = new WP_Query($args);

while ($query->have_posts()) {
    $query->the_post();

    array_push($posts, [
        "id" => get_the_ID(),
        "title" => the_title('', '', false)
    ]);
}

echo json_encode($posts);
