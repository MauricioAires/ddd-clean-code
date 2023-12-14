import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CommentProps {
  authorId: UniqueEntityID
  content: string
  createAt: Date
  updatedAt?: Date
}

/**
 * NOTE: Não crie nenhum setter no começo,
 * so crier um setter de acordo com a necessidade
 */

/**
 * Uma classe abstract não pode ser instanciada ( new ClassName() ) apenas estendida class extends ClassName
 */
export abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content

    this.touch()
  }

  get createAt() {
    return this.props.createAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  /**
   * Realizar o updateAt
   */
  private touch() {
    this.props.updatedAt = new Date()
  }
}
