import { type NotificationType } from '@/enums/NotificationType'

export default interface Notification {
  id: string
  message: string
  type: NotificationType
}
