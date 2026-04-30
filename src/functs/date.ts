/**
 * remove hours/minutes/seconds from date
 *
 * @function
 * @name dateWithoutHours
 * @kind variable
 * @param {string | Date} date
 * @returns {Date}
 * @exports
 */
export const dateWithoutHours = (date: Date | string): Date => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * return now date withtout hours/minutes/secondes
 *
 * @function
 * @name nowDate
 * @kind variable
 * @returns {Date}
 * @exports
 */
export const nowDate = (): Date => {
  return dateWithoutHours(new Date())
}

/**
 * format time
 * @function
 * @name formatTime
 * @kind variable
 * @param {string | Date} date
 * @param {string} locale
 * @returns {string}
 * @exports
 */
export const formatTime = (date: string | Date, locale: string, config = {}): string => {
  date = new Date(date)
  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: date.getMinutes() ? 'numeric' : undefined,
    ...config,
  })
}

/**
 * format datetime with/witout minutes/hours if needed
 *
 * @function
 * @name formatDateTime
 * @kind variable
 * @param {Date | string} date
 * @param {string} locale
 * @returns {string}
 * @exports
 */
export const formatDateTime = (date: Date | string, locale: string, config = {}): string => {
  date = new Date(date)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: date.getHours() ? 'numeric' : undefined,
    minute: date.getMinutes() ? 'numeric' : undefined,
    ...config,
  })
}

/**
 * format date with/witout minutes/hours if needed
 *
 * @function
 * @name formatDate
 * @kind variable
 * @param {string | Date} date
 * @param {string} locale
 * @returns {string}
 * @exports
 */
export const formatDate = (date: Date | string, locale: string, config = {}): string => {
  return formatDateTime(date, locale, {
    hour: undefined,
    minute: undefined,
    ...config,
  })
}

/**
 * safe convert date with 15 minutes grid incrementation
 *
 * @function
 * @name sanitizeDate
 * @kind variable
 * @param {Date} date
 * @returns {Date}
 * @exports
 */
export const sanitizeDate = (date: Date | string) => {
  date = new Date(date)
  const minutes = Math.floor(date.getMinutes() / 15) * 15
  date.setHours(date.getHours(), minutes, 0, 0)

  return date
}

/**
 * merge time to another date
 *
 * @function
 * @name mergeTime
 * @kind variable
 * @param {string | Date} date
 * @param {string | Date} dateTime
 * @returns {Date}
 * @exports
 */
export const mergeTime = (date: Date | string, dateTime: Date | string): Date => {
  date = new Date(date)
  dateTime = new Date(dateTime)

  date.setHours(dateTime.getHours(), dateTime.getMinutes(), 0, 0)

  return date
}

/**
 * return date string format
 *
 * @function
 * @name fullYearDateFormat
 * @kind variable
 * @param {string | Date} date
 * @returns {string}
 * @exports
 */
export const YearMonthDateFormat = (date: Date | string): string => {
  const today = new Date(date)

  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')

  return [year, month].join('-')
}

/**
 * return date string format
 *
 * @function
 * @name fullYearDateFormat
 * @kind variable
 * @param {string | Date} date
 * @returns {string}
 * @exports
 */
export const fullYearDateFormat = (date: Date | string): string => {
  const today = new Date(date)

  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')

  return [year, month, day].join('-')
}

/**
 * get time passwed from date
 *
 * @function
 * @name getTimePassed
 * @kind variable
 * @param {any} d
 * @returns {string}
 * @exports
 */
export const getTimePassed = (d: Date | string): string => {
  /* https://natclark.com/tutorials/javascript-relative-time/ */
  const { locale } = useNuxtI18n()
  const now = new Date().getTime()
  const old = new Date(d).getTime()

  const formatter = new Intl.RelativeTimeFormat(locale.value || 'en', {
    style: `long`,
  })

  const secondsNow = Math.floor(now / 1000)
  const secondsOld = Math.floor(old / 1000)

  const difference = secondsNow - secondsOld

  if (difference < 60) {
    // Less than a minute has passed:
    return formatter.format(-difference, `seconds`)
  } else if (difference < 3600) {
    // Less than an hour has passed:
    return formatter.format(-Math.floor(difference / 60), `minutes`)
  } else if (difference < 86400) {
    // Less than a day has passed:
    return formatter.format(-Math.floor(difference / 3600), `hours`)
  } else if (difference < 2620800) {
    // Less than a month has passed:
    return formatter.format(-Math.floor(difference / 86400), `days`)
  } else if (difference < 31449600) {
    // Less than a year has passed:
    return formatter.format(-Math.floor(difference / 2620800), `months`)
  }

  // More than a year has passed:
  return formatter.format(-Math.floor(difference / 31449600), `years`)
}
