export default function dateToElixirNaiveDate(date: Date, isHours: boolean): string {
  const pad = (num: number) => num.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  if (isHours) {
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const seconds = pad(date.getSeconds())
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  return `${year}-${month}-${day}`
}


export const constructUrl = (userID: string | undefined, startDate: Date | null, endDate: Date | null) => {
  let url = '/api/working_times/' + userID;
  if (startDate && endDate) {
    url += `?start=${dateToElixirNaiveDate(startDate, false)}&end=${dateToElixirNaiveDate(endDate, false)}`;
  } else if (startDate && !endDate) {
    url += `?start=${dateToElixirNaiveDate(startDate, false)}`;
  } else if (!startDate && endDate) {
    url += `?end=${dateToElixirNaiveDate(endDate, false)}`;
  }
  return url;
}