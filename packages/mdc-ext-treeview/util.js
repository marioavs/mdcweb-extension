/** @type {string|undefined} */
let storedMatchesProperty_;

/**
 * @param {!Object} HTMLElementPrototype
 * @return {string}
 */
export function getMatchesProperty(HTMLElementPrototype, forceRefresh = false) {
  if (storedMatchesProperty_ === undefined || forceRefresh) {
    storedMatchesProperty_ = [
      'webkitMatchesSelector', 'msMatchesSelector', 'matches',
    ].filter((p) => p in HTMLElementPrototype).pop();
  }

  return storedMatchesProperty_;
}

/**
 * @param {!Object} element
 * @return {string} selectors
 * @return {!Object}
 */
export function getClosest(element, selectors) {
  if (HTMLElement.prototype.closest)
    return element.closest(selectors);

  const MATCHES = getMatchesProperty(HTMLElement.prototype);
  var el = element;
  var ancestor = element;
  if (!document.documentElement.contains(el)) return null;
  do {
      if (ancestor[MATCHES](selectors)) return ancestor;
      ancestor = ancestor.parentElement;
  } while (ancestor !== null);
  return null;
}
