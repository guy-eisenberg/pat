<?php

class PAT_Activities_Sidebar extends WP_Widget
{
    public function __construct()
    {
        parent::__construct(
            'pat-activities-sidebar',  // Base ID
            'PAT Activities Sidebar'   // Name
        );
        add_action('widgets_init', function () {
            register_widget('PAT_Activities_Sidebar');
        });
    }

    public $args = array();

    public function widget($args, $instance)
    {
        wp_enqueue_style('pat-performance', PAT_PLUGIN_URL . '/templates/performance/dist/index.css');
        wp_enqueue_script('pat-performance', PAT_PLUGIN_URL . '/templates/performance/dist/index.js');

        ob_start();
        require PAT_PLUGIN_DIR . '/templates/performance/activities-sidebar.php';
        echo ob_get_clean();
    }

    public function form($instance)
    {
    }

    public function update($new_instance, $old_instance)
    {
    }
}
