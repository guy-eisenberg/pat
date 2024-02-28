function prefix(num: number) {
  return `${num >= 10 ? '' : '0'}${num}`;
}

export default prefix;
