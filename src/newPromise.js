const STATE = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}

class NPromise {
  constructor (executor) {
    if (typeof executor !== 'function') {
      throw new Error('Executor must be a function')
    }

    this.state = STATE.PENDING
    this.value = undefined
    this.onFulFillChain = []
    this.onRejectCallChain = []

    executor(this.resolve.bind(this), this.reject.bind(this))
  }

  then (onFulFill) {
    return new NPromise(resolve => {
      const onFulfilled = res => {
        resolve(onFulFill(res))
      }

      if (this.state !== STATE.FULFILLED) {
        this.onFulFillChain.push(onFulfilled)
        return
      }

      onFulfilled(this.value)
    })
  }

  catch (onReject) {
    return new NPromise((resolve, reject) => {
      const onRejected = res => {
        try {
          resolve(onReject(res))
        } catch (error) {
          reject(error)
        }
      }

      if (this.state !== STATE.REJECTED) {
        this.onRejectCallChain.push(onRejected)
        return
      }

      onRejected(this.value)
    })
  }

  resolve (res) {
    if (this.state !== STATE.PENDING) {
      return
    }

    if (res !== null && typeof (res?.then) === 'function') {
      return res.then(this.resolve.bind(this))
    }

    this.state = STATE.FULFILLED
    this.value = res

    for (const onFullfilled of this.onFulFillChain) {
      onFullfilled(this.value)
    }
  }

  reject (error) {
    if (this.state !== STATE.PENDING) {
      return
    }

    this.state = STATE.REJECTED
    this.value = error

    for (const onRejected of this.onRejectCallChain) {
      onRejected(error)
    }
  }
}

module.exports = NPromise
