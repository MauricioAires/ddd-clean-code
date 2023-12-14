import { Either, right } from '@/core/either'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

interface FetchQuestionAnswersUseCaseRequest {
  page: number
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}
  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    )

    return right({ answers })
  }
}
