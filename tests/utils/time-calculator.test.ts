import { describe, it, expect, vi } from 'vitest'
import { calculateElapsedTime } from '../../src/utils/time-calculator'

describe('time-calculator > calculateElapsedTime', () => {
  it('should return correct elapsed time', () => {
    const startDate = '2025-03-13T00:00:00'
    const endDate = '2025-03-13T01:30:00'
    const result = calculateElapsedTime(startDate, endDate)
    expect(result).toBe('01:30:00')
  })

  it('should handle same date', () => {
    const startDate = '2025-03-13T00:00:00'
    const endDate = '2025-03-13T00:00:00'
    const result = calculateElapsedTime(startDate, endDate)
    expect(result).toBe('00:00:00')
  })
  it('should return elapsed time greater than 24h', () => {
    const startDate = '2025-03-13T00:00:00'
    const endDate = '2025-03-14T01:00:00'
    const result = calculateElapsedTime(startDate, endDate)
    expect(result).toBe('25:00:00')
  })
  it('should return elapsed time greater than 100h', () => {
    const startDate = '2025-03-13T00:00:00'
    const endDate = '2025-03-18T01:00:00'
    const result = calculateElapsedTime(startDate, endDate)
    expect(result).toBe('121:00:00')
  })
  it('should return null if no from provided', () => {
    const result = calculateElapsedTime(undefined, undefined)
    expect(result).toBeNull()
  })
  it('should handle invalid toDateStr by using current time', () => {
    const mockDate = new Date('2025-01-01T01:12:33')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)

    const fromDateStr = '2025-01-01T00:00:00'
    const toDateStr = 'invalid-date' // This will cause to be set to the current time (mocked time)
    const result = calculateElapsedTime(fromDateStr, toDateStr)
    expect(result).toBe('01:12:33') // Since both dates are the same

    vi.useRealTimers()
  })
  it('should handle absent toDateStr by using current time', () => {
    const mockDate = new Date('2025-01-01T01:12:33')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)

    const fromDateStr = '2025-01-01T00:00:00'
    const result = calculateElapsedTime(fromDateStr, undefined)
    expect(result).toBe('01:12:33') // Since both dates are the same

    vi.useRealTimers()
  })
  it('should throw error because from greater than to', () => {
    const startDate = '2025-03-13T01:30:00'
    const endDate = '2025-03-13T00:00:00'
    expect(() => calculateElapsedTime(startDate, endDate)).toThrowError('Cannot calculate elapsed')
  })
})
