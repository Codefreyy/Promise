const PENDING = 'PENDING'
const FULLFILLED = 'FULLFILLED'
const REJECTED = 'REJECTED'

class MyPromise {

    constructor(executor) {
        this.status = PENDING
        this.value = undefined
        this.reason = undefined

        const resolve = (value) => {
            if(this.status === PENDING) {
                this.status = FULLFILLED
                this.value = value
            }
        }
        const reject = (reason) => {
            if(this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason
            }
        } 

        try{
            executor(resolve, reject)
        } catch(e) {
            reject(e)
        }
    }
   
    

    then(onFullfilled, onRejected) {
        if(this.status === FULLFILLED) {
            onFullfilled(this.value)
        }
        if(this.status === REJECTED) {
            onRejected(this.reason)
        }
    }
}

module.exports = MyPromise