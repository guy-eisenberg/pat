<?php

global $wpdb;
$activities_table = DB_PREFIX . 'activities';
$activity = $wpdb->get_row($wpdb->prepare(
    "SELECT *
                    FROM $activities_table
                    WHERE slug = %s",
    [$atts['activity']]
));
?>

<a class="launch_activity" id="<?php $anchor_id = uniqid("launch_activity_anchor_");
                                echo $anchor_id; ?>" href="<?php echo $activity->run_hyperlink ?>">
    Launch
</a>

<script>
    (function() {
        jQuery('#<?php echo $anchor_id ?>').on('click', function() {
            var ref = window.open(undefined, '_blank', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=' + (screen.width) + ',height=' + (screen.height) + '')

            jQuery.ajax({
                url: "<?php echo PAT_PLUGIN_URL . "api/start-activity.php?activity_id=$activity->id" ?>",
                method: 'GET',
            }).done(function() {
                ref.location = "<?php echo $activity->run_hyperlink ?>"
                // window.open("<?php echo $activity->run_hyperlink ?>", '_blank', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=' + (screen.width) + ',height=' + (screen.height) + '')
            });

            return false;
        })
    })()
</script>