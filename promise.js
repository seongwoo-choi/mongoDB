const addSum = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof a !== 'number' || typeof b !== 'number') return reject('a b is not a number');
      resolve(a + b);
    }, 1000);
  });
};

addSum(10, 20)
  .then((sum1) => addSum(sum1, 30))
  .then((sum2) => console.log({ sum2 }))
  .catch((error) => console.log({ error }));