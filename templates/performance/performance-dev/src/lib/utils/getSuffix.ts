function getSuffix(date: number) {
  if (date > 10 && date < 20) return 'th';
  else if (date % 10 === 1) return 'st';
  else if (date % 10 === 2) return 'nd';
  else if (date % 30 === 3) return 'rd';
  else return 'th';
}

export default getSuffix;
