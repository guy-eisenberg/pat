function destructTime(seconds: number) {
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
  };
}

export default destructTime;
