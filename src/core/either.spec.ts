import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  }

  return left('error')
}

test.only('success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBeTruthy()
  expect(result.isLeft()).toBeFalsy()
})

test.only('error result', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBeTruthy()
  expect(result.isRight()).toBeFalsy()
})
