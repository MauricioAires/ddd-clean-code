import { Entity } from "../../core/entities/entity";
import { UniqueEntityId } from "../../core/entities/unique-entity-id";
import { Optional } from "../../core/types/optional";

interface AnswerProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  content: string;
  createAt: Date;
  updatedAt?: Date;
}

/**
 * NOTE: Não crie nenhum setter no começo,
 * so crier um setter de acordo com a necessidade
 */
export class Answer extends Entity<AnswerProps> {
  get authorId() {
    return this.props.authorId;
  }

  get questionId() {
    return this.props.questionId;
  }

  get content() {
    return this.props.content;
  }

  get createAt() {
    return this.props.createAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;

    this.touch();
  }

  static create(props: Optional<AnswerProps, "createAt">, id?: UniqueEntityId) {
    const answer = new Answer(
      {
        ...props,
        createAt: new Date(),
      },
      id,
    );

    return answer;
  }
}
