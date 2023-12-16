import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Question } from '../entities/question'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  ocurredAt: Date
  question: Question
  bestAnswerId: UniqueEntityID

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.ocurredAt = new Date()
    this.question = question
    this.bestAnswerId = bestAnswerId
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}

/// O que são classes agregadas ??
