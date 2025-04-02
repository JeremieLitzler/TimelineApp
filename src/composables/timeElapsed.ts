// TODO > This state valid globally

import { calculateElapsedTime } from '@/utils/time-calculator'

export const useElapsedTime = () => {
  const evaluate = (from: MaybeRefOrGetter<string | undefined>, to: MaybeRefOrGetter<string>) => {
    return toRef(calculateElapsedTime(from?.toString(), to.toString()))
  }

  return {
    evaluate,
  }
}
