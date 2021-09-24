const addSum = (a, b, callback) => {
  setTimeout(() => {
    if (typeof a !== 'number' || typeof b !== 'number') return callback('a b is not a number');
    callback(undefined, a + b);
  }, 3000);
};

callback = (error, sum) => {
  if (error) return console.log({ error });
  console.log({ sum });
};

addSum(10, 20, callback);