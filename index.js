const MyPromise = require('./MyPromise')

let p1 = new MyPromise((resolve, reject)=> {
    setTimeout(()=> {
        resolve('success')
    })
})

let p2 = new MyPromise((resolve, reject) => {
    setTimeout(()=> {
        reject('error')
    })
})

MyPromise.allSettled([p1, p2]).then(res=> {
    console.log(res);
}).catch(err=> {
    console.log(err);
})