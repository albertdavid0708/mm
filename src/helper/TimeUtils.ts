function getBeginningOfCurrentHour(timestamp: number): number {
  const givenTimestamp = timestamp * 1000; // Convert seconds to milliseconds
  const currentDate = new Date(givenTimestamp);

  // Set minutes and seconds to zero to get the beginning of the hour
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);

  // The resulting timestamp for the current hour
  const currentHourTimestamp = Math.floor(currentDate.getTime() / 1000);

  return currentHourTimestamp;
}

function getBeginningOfCurrentMinute(timestamp: number): number {
  const givenTimestamp = timestamp * 1000; // Convert seconds to milliseconds
  const currentDate = new Date(givenTimestamp);

  // Set seconds to zero to get the beginning of the minute
  currentDate.setSeconds(0);

  // The resulting timestamp for the current minute
  const currentMinuteTimestamp = Math.floor(currentDate.getTime() / 1000);

  return currentMinuteTimestamp;
}

function getBeginningOfCurrentDay(timestamp: number): number {
  const givenTimestamp = timestamp * 1000; // Convert seconds to milliseconds
  const currentDate = new Date(givenTimestamp);

  // Set hours, minutes, and seconds to zero to get the beginning of the day
  currentDate.setHours(0, 0, 0, 0);

  // The resulting timestamp for the current day
  const currentDayTimestamp = Math.floor(currentDate.getTime() / 1000);

  return currentDayTimestamp;
}
function getCurrentEpochTimeInSeconds(): number {
  // Get the current time in milliseconds
  const currentTimeMillis = new Date().getTime();

  // Convert milliseconds to seconds
  const currentTimeSeconds = Math.floor(currentTimeMillis / 1000);

  return currentTimeSeconds;
}

function getBeginningOfPreviousMinute(timestamp: number): number {
  // Convert seconds to milliseconds
  const givenTimestamp = timestamp * 1000;

  // Subtract one minute (60 seconds) from the given timestamp
  const previousMinuteTimestamp = givenTimestamp - 60 * 1000;

  // Create a Date object for the previous minute
  const previousDate = new Date(previousMinuteTimestamp);

  // Set seconds to zero to get the beginning of the minute
  previousDate.setSeconds(0);

  // The resulting timestamp for the beginning of the previous minute
  const previousMinuteTimestampInSeconds = Math.floor(
    previousDate.getTime() / 1000
  );

  return previousMinuteTimestampInSeconds;
}

function getBeginningOfPreviousHour(timestamp: number): number {
  // Convert seconds to milliseconds
  const givenTimestamp = timestamp * 1000;

  // Subtract one hour (3600 seconds) from the given timestamp
  const previousHourTimestamp = givenTimestamp - 3600 * 1000;

  // Create a Date object for the previous hour
  const previousDate = new Date(previousHourTimestamp);

  // Set minutes and seconds to zero to get the beginning of the hour
  previousDate.setMinutes(0, 0, 0);

  // The resulting timestamp for the beginning of the previous hour
  const previousHourTimestampInSeconds = Math.floor(
    previousDate.getTime() / 1000
  );

  return previousHourTimestampInSeconds;
}

function getBeginningOfPreviousDay(timestamp: number): number {
  // Convert seconds to milliseconds
  const givenTimestamp = timestamp * 1000;

  // Subtract one day (86400 seconds) from the given timestamp
  const previousDayTimestamp = givenTimestamp - 86400 * 1000;

  // Create a Date object for the previous day
  const previousDate = new Date(previousDayTimestamp);

  // Set hours, minutes, and seconds to zero to get the beginning of the day
  previousDate.setHours(0, 0, 0, 0);

  // The resulting timestamp for the beginning of the previous day
  const previousDayTimestampInSeconds = Math.floor(
    previousDate.getTime() / 1000
  );

  return previousDayTimestampInSeconds;
}

export {
  getBeginningOfCurrentHour,
  getBeginningOfCurrentDay,
  getBeginningOfCurrentMinute,
  getCurrentEpochTimeInSeconds,
  getBeginningOfPreviousMinute,
  getBeginningOfPreviousHour,
  getBeginningOfPreviousDay,
};
