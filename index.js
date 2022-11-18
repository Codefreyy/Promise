const MyPromise = require('./MyPromise')

MyPromise.resolve(
   new MyPromise((resolve, reject) => {
        setTimeout(()=> {
            resolve('yujie')
        })
    })
).then(res => {
    console.log(11111, res);
})