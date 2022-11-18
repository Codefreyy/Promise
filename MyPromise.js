const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
function resolvePromise (promise2, x, resolve, reject) {
    // if x === promise2
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected'))
    }
    let call = false
    // if x is an object or function
    if((typeof x === 'object' && x!== null) || typeof x === 'function') {
       try {
        let then = x.then // throw error
        if (typeof then === 'function') { // Promise
            then.call(x, (y) => {
                if(call) return
                call = true
                resolvePromise(promise2, y, resolve, reject)
            }, (r)=> {
                if(call) return
                call = true
                reject(r)
            })
        } else {
            resolve(x)
        }
       } catch(e) {
        if(call) return
        call = true
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
        this.onRejectedCallback = []

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED
                this.value = value
                // distribute 发布
                this.onFulfilledCallbacks.forEach(fn => fn())
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason
                // distribute 发布
                this.onRejectedCallback.forEach(fn => fn())
            }
        }

        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }



    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled: (value)=> value
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason
        }
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
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
                this.onRejectedCallback.push(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })
        return promise2
    }
    catch(errorCallback) {
        return this.then(null, errorCallback) // then的第一个成功回调为null
    }
}

module.exports = MyPromise