const msPerMinute = 60 * 1000;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;
const msPerMonth = msPerDay * 30;
const msPerYear = msPerDay * 365;

function weekIdentifier(date: Date): number {
  // Starting date point for our sequence
  var lastDayOfWeekZeroTimestamp = new Date('January 5, 1970 00:00:00').getTime() - 1;
  // Number of week from our starting date
  var weekNumberdiff = Math.ceil(
    (date.getTime() - lastDayOfWeekZeroTimestamp) / (24 * 3600 * 1000 * 7)
  );

  return weekNumberdiff;
}

export function secondToTime(_second: number): string {
  const second = Math.floor(_second % 60)
    .toString()
    .padStart(2, '0');
  const minute = Math.floor((_second / 60) % 60)
    .toString()
    .padStart(2, '0');
  const hour = Math.floor(_second / 3600).toString();

  if (_second < 60) return '0:' + second;
  if (_second < 3600) return `${minute}:${second}`;
  return `${hour}:${minute}:${second}`;
}

export function timeDifference(current: Date, previous: Date): string {
  var elapsed = current.getTime() - previous.getTime();

  if (elapsed < msPerMinute) {
    const second = Math.round(elapsed / 1000);
    return second !== 0 ? second + ' giây trước' : 'vừa xong';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' phút trước';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' giờ trước';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' ngày trước';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' tháng trước';
  } else {
    return Math.round(elapsed / msPerYear) + ' năm trước';
  }
}

export function isToday(target: Date): boolean {
  const now = new Date();

  return (
    target.getDate() === now.getDate() &&
    target.getMonth() === now.getMonth() &&
    target.getFullYear() === now.getFullYear()
  );
}

export function isYesterday(target: Date): boolean {
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

  return (
    target.getDate() === yesterday.getDate() &&
    target.getMonth() === yesterday.getMonth() &&
    target.getFullYear() === yesterday.getFullYear()
  );
}

export function isThisWeek(target: Date): boolean {
  return weekIdentifier(target) === weekIdentifier(new Date());
}
