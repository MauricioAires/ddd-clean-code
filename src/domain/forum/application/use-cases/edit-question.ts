import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { QuestionAttachmentRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentRepository: QuestionAttachmentRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    content,
    title,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toValue()) {
      return left(new NotAllowedError())
    }

    // Current items
    const currentQuestionsAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionsAttachments,
    )

    // New items
    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    /**
     * Atualizar os items - isso retornar uma classe com uma lista dos items
     * que precisa ser excluídos e quais precisa ser cadastrados
     */
    questionAttachmentList.update(questionAttachments)

    question.attachments = questionAttachmentList
    question.title = title
    question.content = content

    await this.questionRepository.save(question)

    return right({ question })
  }
}
