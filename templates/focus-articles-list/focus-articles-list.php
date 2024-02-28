<?php

$current_user_id = get_current_user_id();

global $wpdb;
$posts_table = $wpdb->prefix . 'posts';

$focus_articles_table = DB_PREFIX . 'focus_articles';

$focus_articles = $wpdb->get_results(
    "SELECT *
    FROM $posts_table
    JOIN $focus_articles_table
    ON $focus_articles_table.article_id = $posts_table.ID
    AND $focus_articles_table.user_id = $current_user_id"
);

?>

<div>
    <ul class="favorites-list" id="<?php
                                    $favorites_list_id = uniqid("favorites_list_");

                                    echo $favorites_list_id;
                                    ?>">
        <?php foreach ($focus_articles as $article) { ?>
            <li><a href="<?php echo get_permalink($article->ID) ?>"><?php echo $article->post_title ?></a></li>
        <?php } ?>
    </ul>
    <br>
    <br>
    <button class="simplefavorites-clear" id="<?php
                                                $clear_favorites_button_id = uniqid("clear_favorites_button_");

                                                echo $clear_favorites_button_id;
                                                ?>">Remove all Focus Articles</button>
</div>

<script>
    (function() {
        jQuery('#<?php echo $clear_favorites_button_id ?>').on('click', function() {
            jQuery.ajax({
                url: "<?php echo PAT_PLUGIN_URL . 'api/clear-all-focus-articles.php' ?>",
                type: 'POST'
            }).done(function() {
                document.querySelector('#<?php echo $favorites_list_id ?>').innerHTML = '';
            });
        });
    })()
</script>