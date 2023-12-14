import { PaginationParams } from '@/core/repositories/paginate-params'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  create(data: AnswerComment): Promise<void>
  delete(data: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
}
