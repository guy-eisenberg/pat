function getDatePreview(value: string | number) {
  const date = new Date(value);

  if (!(date instanceof Date) || isNaN(date.getTime())) return '';

  return `${date.getDate()}${getSuffix(date.getDate())} ${getMonth(
    date.getMonth()
  )} ${date.getFullYear()}`;
}

export default getDatePreview;

function getSuffix(date: number) {
  if (date > 10 && date < 20) return 'th';
  else if (date % 10 === 1) return 'st';
  else if (date % 10 === 2) return 'nd';
  else if (date % 30 === 3) return 'rd';
  else return 'th';
}

function getMonth(month: number) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return months[month];
}
