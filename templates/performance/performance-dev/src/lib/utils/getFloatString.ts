function getFloatString(float: number) {
  return float % 1 === 0 ? `${float}.0` : `${float.toFixed(1)}`;
}

export default getFloatString;
