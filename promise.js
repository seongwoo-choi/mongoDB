const addSum = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof a !== 'number' || typeof b !== 'number') return reject('a b is not a number');
      resolve(a + b);
    }, 1000);
  });
};

addSum(10, 'sum')
  .then((sum) => console.log({ sum }))
  .catch((error) => console.log({ error }));