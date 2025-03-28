export const formatTime = (minutes: number): string => {
  const hours = Math.ceil(minutes / 60);
  if (hours >= 8) {
    const days = Math.floor(hours / 8);
    const remainingHours = hours % 8;
    if (remainingHours === 0) {
      return `${days}d`;
    }
    return `${days}d ${remainingHours}h`;
  }
  return `${hours}h`;
};
