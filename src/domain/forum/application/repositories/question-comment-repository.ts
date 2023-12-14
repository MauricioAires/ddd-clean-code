import { PaginationParams } from '@/core/repositories/paginate-params'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export interface QuestionCommentRepository {
  create(data: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | null>
  delete(data: QuestionComment): Promise<void>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
}
