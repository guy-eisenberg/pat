<?php
global $wpdb;
$activities_table = DB_PREFIX . 'activities';
$activity = $wpdb->get_row($wpdb->prepare(
    "SELECT *
                    FROM $activities_table
                    WHERE slug = %s",
    [$atts['activity']]
));

if ($activity === null) return;

$focus_activities_table = DB_PREFIX . 'focus_activities';
$current_user_id = get_current_user_id();

$focused = $wpdb->get_row(
    "SELECT *
                    FROM $focus_activities_table
                    WHERE activity_id = $activity->id
                    AND user_id = $current_user_id"
) !== null;
?>

<div id="<?php
            $activity_box_id = uniqid('activity_box_');

            echo $activity_box_id; ?>" class="activity_prog_type_container">
    <a href="<?php echo $activity->page_hyperlink ?>" class="activity_prog_type">
        <div class="activity_img"><img src=<?php echo $activity->image ?>></div>
        <div class="activity_title"><?php echo $activity->name ?></div>
        <div class="activity_data">
            <div class="unit_data_1"><?php echo $activity->description ?></div>
        </div>
    </a>
    <button id="<?php
                $focus_activity_button_id = uniqid('focus_activity_button_');

                echo $focus_activity_button_id; ?>" class="focus-button">
        <img id="focus-icon" alt="focus icon" src="<?php echo PAT_PLUGIN_URL . 'templates/activity-box/' . ($focused ? 'assets/focus_activity_active.svg' : 'assets/focus_activity_inactive.svg') ?>">
    </button>
</div>

<script>
    (function() {
        jQuery('#<?php echo $focus_activity_button_id ?>').on('click', function() {
            jQuery.ajax({
                url: "<?php echo PAT_PLUGIN_URL . 'api/focus-activity-toggle.php' ?>",
                data: {
                    activity_id: <?php echo $activity->id ?>
                },
                type: 'POST'
            }).done(function(focused) {
                document.querySelector('#<?php echo $focus_activity_button_id ?> > img').src = "<?php echo PAT_PLUGIN_URL . 'templates/activity-box/' ?>" + (focused ? 'assets/focus_activity_active.svg' : 'assets/focus_activity_inactive.svg');

                if (<?php echo ($atts['only_focused'] === 'true') ? 'true' : 'false' ?>) document.querySelector('#<?php echo $activity_box_id ?>').style.display = focused ? 'inline-block' : 'none';
            });
        })
    })()
</script>