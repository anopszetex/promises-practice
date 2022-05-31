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
    test('should then a Promise', async () => {
      const promise = new NPromise(resolve => resolve({ data: 'fake' }))

      await expect(promise)
      .resolves
      .toEqual({ data: 'fake' })
    })

    test('should call then just when the async code is resolved', async () => {
      const promise = new NPromise(resolve => {
        setTimeout(() => resolve({ data: 'fake'}), 1e2)
      })

      await expect(promise)
      .resolves
      .toEqual({data: 'fake'})
    })

    test('should allow the same promise to be thenable multiple times', async () => {
      const p1 = new NPromise(resolve => setTimeout(() => resolve({ data: 'fake' }), 10))
      
      p1
      .then(res => expect(res.data).toBe('fake'))

      await expect(p1)
      .resolves
      .toEqual({ data: 'fake' })
    })

  })
})
