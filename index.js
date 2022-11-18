const MyPromise = require('./MyPromise')

let promise1 = new MyPromise((resolve, reject)=> {
    setTimeout(()=> {
        resolve('success')
    }, 0)
})

promise1.then().then((value)=>{
    resolve(value)
}, ()=>{
}).then(value=> {
    console.log(111, value);
}, reason => {
    console.log('error', reason);
})

