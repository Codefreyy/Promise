const MyPromise = require('./MyPromise')
let promise1 = new MyPromise((resolve, reject)=>{
    resolve('first resolve')
})

let promise2 = promise1.then(()=> {
   // return new Error('Error')
//    return Promise.resolve('Promise Resolve')
  return new MyPromise((resolve, reject) => {
    setTimeout(()=> {
    resolve(new MyPromise((resolve, reject)=> {
        resolve('kkkkk')
    }))
    },0)
  })
}, (reason)=> {
    return reason
})

promise2.then().then().then().then(value => {
    throw new Error('error!!!')
}, (reason) => {
    console.log(reason);
})
.catch(e => {
    console.log('e', e);
})