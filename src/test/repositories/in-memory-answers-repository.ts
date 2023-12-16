import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/paginate-params'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(private answerAttachmentRepository: AnswerAttachmentRepository) {}

  async create(answer: Answer) {
    this.items.push(answer)

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(itemIndex, 1)

    await this.answerAttachmentRepository.deleteManyByAnswerId(
      answer.id.toString(),
    )
  }

  async save(data: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === data.id)

    this.items[itemIndex] = data

    DomainEvents.dispatchEventsForAggregate(data.id)
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }
}
