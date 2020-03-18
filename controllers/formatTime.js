const formatTime = (t) => {
  const f = Math.floor;
  return (t > 3600 ? "" + f(t / 3600) + "h " : "") + (t > 60 ? f(t % 3600 / 60) + "m" : t % 3600 + "s");
};

export default formatTime;