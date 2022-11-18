## 链式调用的实现
1. 每个then都返回一个promise
2. let x = onFulfilled(this.value)
let x = onRejected(this.reason)

执行onFulfilled和onRejected的时候也有可能抛出异常，需要处理

** 但是这里拿不到promise2， 使用`setTimeout()`把它变成异步的，等其它promise2执行完了，它就能
拿到promise2 **

3. x可能是promise，可能是`function object ''`等等，对于x的处理，写一个`resolvePromise`
的函数：

`resolvePromise(promise2, x, resolve, reject)`

- 提前判断：x不能和promise2一样，否则会死循环，需要判断并reject `new TypeError`
- 如果x是一个对象或Function
    保存x.then给x
    - x有可能是一个promise
        - 如果它是promise，就有then()方法
            ** 在取then的时候，也就是调用底层的get()的时候，有可能会报错，需要
            `try-catch`一下
        - 执行这个then，用call方法指定它的this为x，传入两个回调函数分别代表onFulfilled()
        和onRejected()
        
    - x有可能是一个普通对象 resolve()
- 如果x不是一个对象，它就是一个基本类型，直接resolve()

4. `onFullfilled` 和`onRejected` 不能重复调用
    用一个变量存储它是否被调用，第二次进来的时候根据变量标识判断return

5. 如果我return的promise里面，再嵌套一个promise，就不能继续处理，需要弄以一个递归。
    - 成功的时候递归地调用resolvePromise，reject的时候不需要，因为已经失败了。

6. onFulfilled和onRejected是optional的，有可能不存在，需要做处理。
    如果不是一个函数的话，我们把上一个promise返回的值包装成一个箭头函数，给后面的then使用。

7. 写一个catch方法，它其实就是then的语法糖，传入的参数是一个失败的时候执行的回调函数（errorCallback)，
在这方法里面调用then，第一个参数（onFulfilled)是null（因为失败才需要catch）,
第二个参数（onRejected）就是传入的这个回调函数（errorCallback)。

