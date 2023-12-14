import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-question-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository)

    // sut => system under test
  })
  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Question Title',
      content: 'Nova resposta',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question)
  })
})
