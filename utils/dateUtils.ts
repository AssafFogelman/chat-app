export const age = (dateOfBirth: Date) => {
  const diff_ms = Date.now() - dateOfBirth.getTime();
  const age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970) + "";
};

/* the function receives a date and returns the time passed from now */
//formatDate shows the hours since, if the timestamp is in the current day
//formDate2 only writes "today", if the timestamp is in the current day

const formatDate = (inputDate: string) => {
  const dateAsDate = new Date(inputDate);
  const nowAsDate = new Date();
  const dayDifference = Math.abs(dateAsDate.getDay() - nowAsDate.getDay());
  const nowAsMilliseconds = nowAsDate.getTime(); //get time in milliseconds
  const inputDateTime = dateAsDate.getTime(); //get time in milliseconds
  const timeDifference =
    (nowAsMilliseconds - inputDateTime) / (1000 * 60 * 60 * 24); // Calculate the difference in days

  if (dayDifference === 0 && timeDifference <= 2) {
    // Same day, same week
    return dateAsDate.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  if (dayDifference === 1 && timeDifference <= 3) {
    // Yesterday, same week
    return "yesterday";
  }
  if (dayDifference <= 7 && timeDifference < 8) {
    // Weekday
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return weekdays[dateAsDate.getDay()];
  }

  // More than 7 days ago
  const day = dateAsDate.getDate();
  const month = dateAsDate.getMonth() + 1; // Months are 0-indexed
  return `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}`;
};

const formatDate2 = (inputDate: string) => {
  const dateAsDate = new Date(inputDate);
  const nowAsDate = new Date();
  const dayDifference = Math.abs(dateAsDate.getDay() - nowAsDate.getDay());
  const nowAsMilliseconds = nowAsDate.getTime(); //get time in milliseconds
  const inputDateTime = dateAsDate.getTime(); //get time in milliseconds
  const timeDifference =
    (nowAsMilliseconds - inputDateTime) / (1000 * 60 * 60 * 24); // Calculate the difference in days

  if (dayDifference === 0 && timeDifference <= 2) {
    // Same day, same week
    return "today";
  }
  if (dayDifference === 1 && timeDifference <= 3) {
    // Yesterday, same week
    return "yesterday";
  }
  if (dayDifference <= 7 && timeDifference < 8) {
    // Weekday
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return weekdays[dateAsDate.getDay()];
  }

  // More than 7 days ago
  const day = dateAsDate.getDate();
  const month = dateAsDate.getMonth() + 1; // Months are 0-indexed
  return `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}`;
};

export default formatDate;
export { formatDate2 };
