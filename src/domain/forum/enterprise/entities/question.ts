import dayjs from 'dayjs'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Slug } from './value-objects/slug'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  title: string
  slug: Slug
  content: string
  attachments: QuestionAttachmentList
  createAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
      /**
       * Realizar a criação do evento de domínio no modo de draft
       */
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId

    this.touch()
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)

    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content

    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments

    this.touch()
  }

  get createAt() {
    return this.props.createAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew() {
    return dayjs().diff(this.createAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuestionProps, 'createAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        createAt: props.createAt ?? new Date(),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        slug: props.slug ?? Slug.createFromText(props.title),
      },
      id,
    )

    return question
  }
}
