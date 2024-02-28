import React from 'react';
import ReactDOM from 'react-dom/client';
import ActivitiesSidebar from './ActivitiesSidebar';
import ActivityPerformance from './ActivityPerformance';
import Dashboard from './Dashboard';
import Performance from './Performance';
import './index.css';

const activitiesSidebarRoot = document.getElementById(
  'activities-sidebar-root'
);
if (activitiesSidebarRoot) {
  ReactDOM.createRoot(activitiesSidebarRoot).render(
    <React.StrictMode>
      <ActivitiesSidebar />
    </React.StrictMode>
  );
}

const activityPerformanceRoot = document.getElementById(
  'activity-performance-root'
);
if (activityPerformanceRoot) {
  const activity = activityPerformanceRoot.dataset.activity;

  if (activity) {
    ReactDOM.createRoot(activityPerformanceRoot).render(
      <React.StrictMode>
        <ActivityPerformance activity={activity} />
      </React.StrictMode>
    );
  }
}

const dashboardRoot = document.getElementById('dashboard-root');
if (dashboardRoot) {
  ReactDOM.createRoot(dashboardRoot).render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  );
}

const performanceRoot = document.getElementById('performance-root');
if (performanceRoot) {
  ReactDOM.createRoot(performanceRoot).render(
    <React.StrictMode>
      <Performance />
    </React.StrictMode>
  );
}
