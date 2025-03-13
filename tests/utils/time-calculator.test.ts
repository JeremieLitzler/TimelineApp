import { describe, it, expect } from 'vitest'
import { calculateElapsedTime } from '../../src/utils/time-calculator'

describe('calculateElapsedTime', () => {
  it('should return correct elapsed time', () => {
    const startDate = new Date('2025-03-13T00:00:00')
    const endDate = new Date('2025-03-13T01:30:00')
    const result = calculateElapsedTime(startDate, endDate)
    expect(result).toBe('01:30:00')
  })

  it('should handle same date', () => {
    const startDate = new Date('2025-03-13T00:00:00')
    const endDate = new Date('2025-03-13T00:00:00')
    const result = calculateElapsedTime(startDate, endDate)
    expect(result).toBe('00:00:00')
  })
  it('should return elapsed time greater than 24h', () => {
    const startDate = new Date('2025-03-13T00:00:00')
    const endDate = new Date('2025-03-14T01:00:00')
    const result = calculateElapsedTime(startDate, endDate)
    expect(result).toBe('25:00:00')
  })
  it('should return elapsed time greater than 100h', () => {
    const startDate = new Date('2025-03-13T00:00:00')
    const endDate = new Date('2025-03-18T01:00:00')
    const result = calculateElapsedTime(startDate, endDate)
    expect(result).toBe('121:00:00')
  })

  it('should throw error because from greater than to', () => {
    const startDate = new Date('2025-03-13T01:30:00')
    const endDate = new Date('2025-03-13T00:00:00')
    expect(() => calculateElapsedTime(startDate, endDate)).toThrowError('Cannot calculate elapsed')
  })
})
