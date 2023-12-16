import { Notification } from '@/domain/notification/enterprise/entities/notification'

export interface NotificationsRepository {
  create(data: Notification): Promise<void>
  findById(id: string): Promise<Notification | null>
  save(data: Notification): Promise<void>
}
