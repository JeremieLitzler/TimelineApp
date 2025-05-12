import type { CacheValidationKeyInfo } from '@/types/CacheValidationInfo'
import { timeStampExpired, validateCache } from '@/utils/cache-validation'
import {
  allRecordsWithProjectOrTaskQuery,
  createRecordQuery,
  updateRecordQuery,
  type AllRecordsWithProjectOrTaskType,
  type TimeRecordWithProjectOrTaskType,
} from '@/services/supabase-records-queries'
import type { PostgrestError } from '@supabase/supabase-js'
import { useMemoize } from '@vueuse/core'
import { toISOStringWithTimezone } from '@/utils/date-format'
import type { TimeRecord } from '@/types/TimeRecord'

export const useRecordStore = defineStore('Time-records-store', () => {
  const GET_METHODS_EXPIRATION = 900 // 15 min
  const _recordsLastFetchTime = ref<CacheValidationKeyInfo>({})
  const records = ref<AllRecordsWithProjectOrTaskType | null>()

  const _validateCacheRecords = async (forceRefresh: boolean = false) =>
    validateCache<
      typeof records,
      typeof allRecordsWithProjectOrTaskQuery,
      typeof _loadRecords,
      PostgrestError
    >({
      key: StoreCacheKey.AllRecords,
      loaderFn: _loadRecords,
      query: allRecordsWithProjectOrTaskQuery,
      reference: records,
      lastFetchInfo: {
        ..._recordsLastFetchTime.value[StoreCacheKey.AllRecords],
        forceRefresh,
      },
    })
  const _forceRefreshOnRecords = () => {
    return timeStampExpired({
      timeStamp: _recordsLastFetchTime.value[StoreCacheKey.AllRecords].timeStamp,
      invalidateAfterSeconds: GET_METHODS_EXPIRATION,
    })
  }
  const clearCache = () => {
    console.log('called clearCache')
    _loadRecords.clear()
    console.log('cleared records')
    // console.log('cleared individual records')
  }
  const _loadRecords = useMemoize(async (key: string) => {
    const { data, error, status } = await allRecordsWithProjectOrTaskQuery

    // console.log(data)

    if (error) {
      useErrorStore().setError({ error, customCode: status })
    } else {
      _recordsLastFetchTime.value[StoreCacheKey.AllRecords] = { timeStamp: Date.now() }
    }

    return data
  })
  const _groupByDate = () => {
    // Take all records and group them into a dictionnary with the key being the date
    // And the value being an array of records.
    //
    // The key is the date in "YYYY-mm-DD" format
  }
  const getRecords = async () => {
    records.value = null
    records.value = await _loadRecords(StoreCacheKey.AllRecords)
    _validateCacheRecords(_forceRefreshOnRecords())
  }

  const addRecord = async (newRecord: TimeRecordRequestNew) => {
    const { data, error, status } = await createRecordQuery(newRecord)
    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }
    _validateCacheRecords(true)
    return data
  }
  const updateRecord = async (updatedRecord: TimeRecordWithProjectOrTaskType | TimeRecord) => {
    const { projects, tasks, record_uid, ...RecordProps } = updatedRecord
    RecordProps.ended_at = toISOStringWithTimezone(new Date())
    RecordProps.updated_at = toISOStringWithTimezone(new Date())
    const { count, data, error, status } = await updateRecordQuery(RecordProps, record_uid!)
    if (error) {
      useErrorStore().setError({ error, customCode: status })
    }
    if (count && count > 1) {
      useErrorStore().setError({ error: Error('Many records updated...'), customCode: 500 })
    }
    console.log('saved new record end date...')

    _validateCacheRecords(true)
    return data
  }

  const deleteRecord = async (record: SingleRecordWithProjectOrTaskType | Record) => {
    const softDeleteRecord = {
      ...record,
      deleted: true,
      deleted_at: toISOStringWithTimezone(new Date()),
    }
    await updateRecord(softDeleteRecord)
  }
  return {
    records,
    clearCache,
    getRecords,
    addRecord,
    updateRecord,
    deleteRecord,
  }
})
