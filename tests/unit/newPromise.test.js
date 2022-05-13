const NPromise = require('@/newPromise')

describe('Promise', () => {
  test('should return an error if it dont pass a function as parameter', () => {
     expect(() => new NPromise('myValue')).toThrow('Executor must be a function')
  })

  test('should create a new promise with pending state', () => {
    const promise = new NPromise(() => {})

    expect(promise.state).toBe('pending')
    expect(promise.value).toBe(undefined)
  })

  describe('When fulfilled', () => {
    test.only('should then a Promise', async () => {
      const promise = new NPromise(resolve => resolve({ data: 'fake' }))

      await expect(promise)
      .resolves
      .toEqual({ data: 'fake' })
    })
  })
})
