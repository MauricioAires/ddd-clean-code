import { PaginationParams } from '@/core/repositories/paginate-params'
import { Question } from '@/domain/forum/enterprise/entities/question'

export interface QuestionRepository {
  create(data: Question): Promise<void>
  save(data: Question): Promise<void>
  findBySlug(slug: string): Promise<Question | null>
  findById(id: string): Promise<Question | null>
  delete(question: Question): Promise<void>
  findManyRecent(params: PaginationParams): Promise<Question[]>
}
