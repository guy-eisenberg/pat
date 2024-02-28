function isSameDate(d1: Date | undefined, d2: Date | undefined) {
  if (d1 === undefined || d2 === undefined) return false;

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default isSameDate;
