import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-question-repository'
import { makeQuestion } from '@/test/factories/make-question'

import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionRepository.create(
      makeQuestion({
        createAt: new Date(2023, 0, 20),
      }),
    )
    await inMemoryQuestionRepository.create(
      makeQuestion({
        createAt: new Date(2023, 0, 18),
      }),
    )
    await inMemoryQuestionRepository.create(
      makeQuestion({
        createAt: new Date(2023, 0, 23),
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({
        createAt: new Date(2023, 0, 23),
      }),
      expect.objectContaining({
        createAt: new Date(2023, 0, 20),
      }),
      expect.objectContaining({
        createAt: new Date(2023, 0, 18),
      }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(2)
  })
})