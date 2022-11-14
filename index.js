const MyPromise = require('./MyPromise')

let promise = new MyPromise((resolve,reject)=>{ // executor
    // reject('e')
    // resolve('dasad')
    throw new Error('e')
})

promise.then((value)=>{
    console.log(123, value);
}, (reason)=>{
    console.log('错误：', reason);
})

