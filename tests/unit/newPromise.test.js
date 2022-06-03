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
        setTimeout(() => resolve({ data: 'fake'}), 10)
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


    test('should support chain of promises on which promises are returned', async () => {
      const fakeFSPromise = new Promise(resolve => {
         setTimeout(() => {
          resolve({ file: 'photo.jpg' }, 10)
        })
      })
      

      new NPromise(resolve => {
        setTimeout(() => resolve({data: 'promise1'}), 1)
      }).then(response => {
        expect(response.data).toBe('promise1')

        return fakeFSPromise
      })
      .then(response => {
        expect(response.file).toBe('photo.jpg')
      })

    });

  })

  describe('Error handling', () => {
    test('should call catch when an error is throw', async () => {
      const errorMessage = 'Promise has been rejected'

      return new NPromise((resolve, reject) => {
        setTimeout(() => reject(new Error(errorMessage)), 10)
      })
      .catch(error => {
        expect(error.message).toBe(errorMessage)
      })
    })

    test('should allow catch to be thenable', () => {
      const errorMessage = 'Promise has been rejected'

      return new NPromise((resolve, reject) => {
        setTimeout(() => reject(new Error(errorMessage)), 10)
      })
      .catch(error => {
        expect(error.message).toBe(errorMessage)
        return { data: 'someData' }
      })
      .then((response) => {
        expect(response.data).toBe('someData')
      })
    })

    test('should allow to catch an error thrown by a previous catch method', () => {
      const errorMessage = 'Promise has been rejected'

      return new NPromise((resolve, reject) => {
        setTimeout(() => reject(new Error(errorMessage)), 10)
      })
      .catch(error => {
        expect(error.message).toBe(errorMessage)
       throw new Error('That is another error')
      })
      .catch((error) => {
        expect(error.message).toBe('That is another error')
      })
    })

  })

})
