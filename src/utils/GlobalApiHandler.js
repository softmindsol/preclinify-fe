export function debounce(func, delay) {
  let timer;

  return function (...args) {
    const context = this;

    // Clear the previous timer
    clearTimeout(timer);

    // Set a new timer
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
