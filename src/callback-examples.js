const assert = require('assert')

const myPromise = {
  val: undefined,
  resolve (cb) {
    this.val = cb()
    return this
  },
  then (res) {
    return res(this.val)
  }
}

const expected = myPromise.resolve(() => {
  return { data: 'fake' }
})
  .then((res) => res.data)

assert.equal(expected, 'fake')

const mainFn = (anotherFn) => anotherFn(1)

const execute = mainFn(res => res)

assert.equal(execute, 1)
