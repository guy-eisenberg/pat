<?php
global $wpdb;
$focus_articles_table = DB_PREFIX . 'focus_articles';

$current_user_id = get_current_user_id();
$current_post_id = get_the_ID();

$is_focused = $wpdb->get_row(
    "SELECT *
    FROM $focus_articles_table
    WHERE user_id = $current_user_id
    AND article_id = $current_post_id"
) !== null;
?>

<a class="simplefavorite-button">
    <div class="<?php echo ($is_focused ? 'remove_from_focus_articles' : 'add_to_focus_articles') ?>" id="<?php
                                                                                                            $focus_article_button_id = uniqid('focus_article_button_');
                                                                                                            echo $focus_article_button_id;
                                                                                                            ?>">
        <?php echo ($is_focused ? 'Remove from Focus Articles' : 'Add to Focus Articles') ?>
    </div>
</a>

<script>
    (function() {
        jQuery('#<?php echo $focus_article_button_id ?>').on('click', function() {
            jQuery.ajax({
                url: "<?php echo PAT_PLUGIN_URL . 'api/focus-article-toggle.php' ?>",
                data: {
                    article_id: <?php echo $current_post_id ?>
                },
                type: 'POST'
            }).done(function(focused) {
                const button = document.querySelector('#<?php echo $focus_article_button_id ?>');

                button.innerHTML = focused ? 'Remove from Focus Articles' : 'Add to Focus Articles';
                button.className = focused ? 'remove_from_focus_articles' : 'add_to_focus_articles';
            })
        })
    })()
</script>