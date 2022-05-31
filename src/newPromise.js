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

    executor(this.resolve.bind(this))
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

  resolve (res) {
    if (this.state !== STATE.PENDING) {
      return
    }

    this.state = STATE.FULFILLED
    this.value = res

    for (const onFullfilled of this.onFulFillChain) {
      onFullfilled(this.value)
    }
  }
}

module.exports = NPromise
