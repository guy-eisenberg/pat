import getSuffix from "./getSuffix";

function getSmallDatePreview(value: string | number) {
  const date = new Date(value);

  if (!(date instanceof Date) || isNaN(date.getTime())) return "";

  return `${getSmallWeekdayName(date.getDay())} ${date.getDate()}${getSuffix(
    date.getDate()
  )} ${getSmallMonthName(date.getMonth())} ${date.getFullYear()}`;
}

export default getSmallDatePreview;

function getSmallWeekdayName(day: number) {
  const weekday = ["Sun.", "Mon.", "Tues.", "Weds.", "Thu.", "Fri.", "Sat."];

  return weekday[day];
}

function getSmallMonthName(month: number) {
  const months = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];

  return months[month];
}
