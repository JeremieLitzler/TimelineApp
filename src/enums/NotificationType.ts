// export enum NotificationType {
//   Info = 'info',
//   Success = 'success',
//   Warning = 'warning',
//   Error = 'error',
// }

import { tupleToObj } from '@/utils/tuple-to-object'

const NOTIFICATION_TYPE_OPTIONS = ['info', 'success', 'warning', 'error'] as const
export type NotificationType = (typeof NOTIFICATION_TYPE_OPTIONS)[number]
export const NotificationType = {
  /**
   * Utility function to check if a value is a PageView
   * This is useful for type guards and allows you to narrow
   * the type in your code.
   *
   * Usage:
   * ```ts
   * const something = 'Preview'
   * if (PageView.isPageView(something)) {
   * // your typescript code now knows that something is a PageView
   * }
   *
   * PageView.isPageView('Preview'); // true
   * PageView.isPageView('yellow'); // false
   * ```
   */
  isPageView: (val: unknown): val is NotificationType =>
    typeof val === 'string' && NOTIFICATION_TYPE_OPTIONS.includes(val as NotificationType),
  /**
   * Easily access the values if you want to reach for it.
   */
  VALUES: tupleToObj(NOTIFICATION_TYPE_OPTIONS),
} as const
