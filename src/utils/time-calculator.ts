/**
 * Calculates the elapsed time between two dates and formats it as "hh:MM:ss".
 * Handles negative time differences by taking the absolute value.
 *
 * @param {Date} from The start date.
 * @param {Date} to The end date.
 * @returns {string} The elapsed time in "hh:MM:ss" format.
 */
export const calculateElapsedTime = (
  fromDateStr?: string | null,
  toDateStr?: string | null | undefined,
): string | null | undefined => {
  if (!fromDateStr) {
    return null
  }
  // Convert string inputs to Date objects
  const from = new Date(fromDateStr)
  let to = new Date(toDateStr ?? '')

  // Check if from date is valid
  if (isNaN(from.getTime())) {
    return null
  }
  if (toDateStr === undefined || isNaN(to.getTime())) to = new Date(Date.now())

  if (from > to) {
    throw new Error('Cannot calculate elapsed time if from greater than to')
  }
  const timeDifferenceMS = Math.abs(to.getTime() - from.getTime())

  // Convert milliseconds to seconds, minutes, and hours
  const seconds = Math.floor((timeDifferenceMS % 60000) / 1000)
  const minutes = Math.floor((timeDifferenceMS % 3600000) / 60000)
  const hours = Math.floor(timeDifferenceMS / 3600000)

  // Format the time as "hh:MM:ss"
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return formattedTime
}
