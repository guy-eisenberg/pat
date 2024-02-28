import { api } from '../clients';
import type {
  AvailableActivity,
  AvailableSkill,
  DatePeformance,
  DBDatePeformance,
} from '../types';

async function fetchActivityPerformance(
  from: Date,
  to: Date,
  filter?: {
    type: 'activity' | 'skill';
    id: string;
  }
): Promise<{
  performances: DatePeformance[];
  available_activities: AvailableActivity[];
  available_skills: AvailableSkill[];
}> {
  try {
    const dates = [];
    var currentDate = new Date(from);
    while (currentDate <= to) {
      dates.push(new Date(currentDate));

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const {
      data: { performances, available_activities, available_skills },
    } = await api.get<{
      performances: DBDatePeformance[];
      available_activities: AvailableActivity[];
      available_skills: AvailableSkill[];
    }>(
      `/get-user-dates-performance.php?dates=${dates.map((date) =>
        date.getTime()
      )}&${filter && `${filter.type}=${filter.id}`}&tz=${
        Intl.DateTimeFormat().resolvedOptions().timeZone
      }`
    );

    return {
      performances: performances.map((performance) => ({
        ...performance,
        date: new Date(performance.date),
        activity: performance.activity.map((activity) => {
          if (activity.activity_type === 'result')
            return {
              ...activity,
              from: new Date(activity.from),
              to: new Date(activity.to),
            };
          else
            return {
              ...activity,
              time: new Date(activity.time),
              start_time: new Date(activity.start_time),
              end_time: new Date(activity.end_time),
              achieve_time: activity.achieve_time
                ? new Date(activity.achieve_time)
                : undefined,
            };
        }),
      })),
      available_activities,
      available_skills,
    };
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchActivityPerformance;
