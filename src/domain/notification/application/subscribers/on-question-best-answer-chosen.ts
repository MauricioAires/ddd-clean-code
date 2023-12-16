import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const bestAnswer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (bestAnswer) {
      await this.sendNotificationUseCase.execute({
        recipientId: bestAnswer.authorId.toString(),
        title: 'Sua resposta foi escolhida!',
        content: `Sua resposta que você enviou em "${question.title
          .substring(0, 20)
          .concat('...')}" foi escolhida author. `,
      })
    }
  }
}
