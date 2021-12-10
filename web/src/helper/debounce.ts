let timeOutID: any;
export const debounceFn = (fn: any, delay: number = 3000) => {
  return (...args: any) => {
    clearTimeout(timeOutID);
    timeOutID = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
