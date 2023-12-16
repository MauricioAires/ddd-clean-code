import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  attachmentsIds: string[]
  content: string
}
type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

// DRY - Don't	Repeat Yourself (3x considerar refatorar)
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}
  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
