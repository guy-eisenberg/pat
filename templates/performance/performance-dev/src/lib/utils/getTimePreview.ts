import getMonthName from './getMonthName';
import getSuffix from './getSuffix';
import getWeekdayName from './getWeekdayName';
import prefix from './prefix';

function getTimePreview(value: string | number) {
  const date = new Date(value);

  if (!(date instanceof Date) || isNaN(date.getTime())) return '';

  return `${getWeekdayName(date.getDay())} ${date.getDate()}${getSuffix(
    date.getDate()
  )} ${getMonthName(date.getMonth())} at ${prefix(date.getHours())}:${prefix(
    date.getMinutes()
  )}`;
}

export default getTimePreview;
