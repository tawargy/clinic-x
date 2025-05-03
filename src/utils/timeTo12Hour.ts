export const formatTimeTo12Hour = (time24: string): string => {
  if (!time24 || !time24.includes(":")) return time24;

  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;

  const period = hour >= 12 ? "PM" : "AM";

  // Convert hour to 12-hour format
  hour = hour % 12;
  // Convert '0' to '12' for 12 AM/PM
  hour = hour === 0 ? 12 : hour;

  return `${hour}:${minute} ${period}`;
};
