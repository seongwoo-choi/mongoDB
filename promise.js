const addSum = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof a !== 'number' || typeof b !== 'number')
                return reject('a b is not a number');
            resolve(a + b);
        }, 1000);
    });
};

// addSum(10, 20)
//   .then(sum1 => addSum(sum1, 40))
//   .then(sum2 => addSum(sum2, 30))
//   .then(sum3 => addSum(sum3, 40))
//   .then(sum => console.log({ sum }))
//   .catch(error => console.log({ error }));

// async await 는 .then .catch 를 사용하지 않고 편하게 사용할 수 있게 해준다.
// try, catch 를 사용하여 .catch 를 사용 가능, error 도 쉽게 잡아줄 수 있다.
const totalSum = async () => {
    try {
        let sum = await addSum(10, 10);
        let sum2 = await addSum(sum, 20);
        let sum3 = await addSum(sum2, 30);
        console.log({ sum, sum2 });
    } catch (error) {
        console.log({ error });
    }
};

totalSum();
