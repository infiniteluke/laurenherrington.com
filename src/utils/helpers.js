/**
 * Credit [gaeron](https://github.com/gaearon/overreacted.io)
 */

export function formatReadingTime(minutes) {
  let flowers = Math.round(minutes / 5);
  if (flowers > 5) {
    return `${new Array(Math.round(flowers / Math.E))
      .fill('💐')
      .join('')} ${minutes} min read`;
  } else {
    return `${new Array(flowers || 1).fill('🌻').join('')} ${minutes} min read`;
  }
}

// `lang` is optional and will default to the current user agent locale
export function formatpostDate(date, lang) {
  if (typeof Date.prototype.toLocaleDateString !== 'function') {
    return date;
  }

  date = new Date(date);
  const args = [
    lang,
    { day: 'numeric', month: 'long', year: 'numeric' },
  ].filter(Boolean);
  return date.toLocaleDateString(...args);
}
