import getMonthName from "./getMonthName";
import getSuffix from "./getSuffix";
import getWeekdayName from "./getWeekdayName";

function getDatePreview(value: string | number) {
  const date = new Date(value);

  if (!(date instanceof Date) || isNaN(date.getTime())) return "";

  return `${getWeekdayName(date.getDay())} ${date.getDate()}${getSuffix(
    date.getDate()
  )} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
}

export default getDatePreview;
