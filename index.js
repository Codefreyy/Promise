const MyPromise = require('./MyPromise')

let promise = new MyPromise((resolve,reject)=>{ // executor
    // throw new Error('e')
    setTimeout(()=>{
    resolve('succss delay')
    },1000)
})

promise.then((value)=>{
    console.log('onFulfilled', value);
}, (reason)=>{
    console.log('错误：', reason);
})

