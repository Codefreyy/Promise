const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<MyPromise>'))
    }

    let called = false

    if((typeof x === 'object' && x!== null) || typeof x === 'function') {
       try {
        let then = x.then // throw error

        if (typeof then === 'function') { // Promise
            then.call(x, (y) => {
                if(called) return;
                called = true;
                resolvePromise(promise2, y, resolve, reject)
            }, (r)=> {
                if(called) return
                called = true
                reject(r)
            })
        } else {
            resolve(x)
        }
       } catch(e) {
        if(called) return
        called = true
        reject(e)
       }
    } else {
        resolve(x)
    }
}
class MyPromise {
    constructor(executor) {
        this.status = PENDING
        this.value = undefined
        this.reason = undefined
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED
                this.value = value
                // distribute 发布
                this.onFulfilledCallbacks.forEach((fn) => fn())
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason
                // distribute 发布
                this.onRejectedCallbacks.forEach((fn) => fn())
            }
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }



    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
               setTimeout(()=>{
                try {
                    let x = onFulfilled(this.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
               }, 0)
            }
            if (this.status === REJECTED) {
                setTimeout(()=>{
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)

                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
            if (this.status === PENDING) {
                // subscribe 订阅
                this.onFulfilledCallbacks.push(() => {
                   setTimeout(()=> {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                   }, 0)
                })

                this.onRejectedCallbacks.push(() => {
                    setTimeout(()=> {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
            }
        })
        return promise2
    }
    catch(errorCallback) {
        return this.then(null, errorCallback) 
    }
}

// 检测这个promise是否符合Promise/A+规范
MyPromise.defer = MyPromise.deferred = function() {
    let deferred = {}
    deferred.promise = new MyPromise((resolve, reject)=> {
        deferred.resolve = resolve;
        deferred.reject = reject
    })
    return deferred
}
module.exports = MyPromise