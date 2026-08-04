const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export const getTodayString = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate() + 1).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const countDays = (startDate: string, endDate: string): number => {
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number);

  const [endYear, endMonth, endDay] = endDate.split('-').map(Number);

  const startTimestamp = Date.UTC(startYear, startMonth - 1, startDay);

  const endTimestamp = Date.UTC(endYear, endMonth - 1, endDay);

  return Math.floor((endTimestamp - startTimestamp) / MILLISECONDS_PER_DAY) + 1;
};
