import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-question-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new EditQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
    )
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('attachment-2'),
      }),
    )

    await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      content: 'Pergunta Test',
      title: 'Conteúdo test',
      attachmentsIds: ['attachment-1', 'attachment-3'],
    })

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      content: 'Pergunta Test',
      title: 'Conteúdo test',
    })
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-3'),
      }),
    ])
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
      content: 'Pergunta Test',
      title: 'Conteúdo test',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryQuestionRepository.items).toHaveLength(1)
  })
})
