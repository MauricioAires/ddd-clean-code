import { Slug } from "./value-objects/slug";
import { Entity } from "../../core/entities/entity";
import { UniqueEntityId } from "../../core/entities/unique-entity-id";
import { Optional } from "../../core/types/optional";

interface QuestionProps {
  authorId: UniqueEntityId;
  bestAnswerId: UniqueEntityId;
  title: string;
  slug: Slug;
  content: string;
  createAt: Date;
  updatedAt?: Date;
}

export class Question extends Entity<QuestionProps> {
  static create(
    props: Optional<QuestionProps, "createAt">,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        createAt: new Date(),
      },
      id,
    );

    return question;
  }
}
