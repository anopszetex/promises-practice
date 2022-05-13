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
      resolve(onFulFill(this.value))
    })
  }

  resolve (res) {
    if (this.state !== STATE.PENDING) {
      return
    }

    this.state = STATE.FULFILLED
    this.value = res
  }
}

module.exports = NPromise
