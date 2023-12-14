import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@/test/factories/make-answer'

import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'Conteúdo Test',
    })

    expect(inMemoryAnswerRepository.items).toHaveLength(1)
    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: 'Conteúdo Test',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
      content: 'Conteúdo Test',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryAnswerRepository.items).toHaveLength(1)
  })
})
