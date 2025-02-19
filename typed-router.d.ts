/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/[...catchAll]': RouteRecordInfo<'/[...catchAll]', '/:catchAll(.*)', { catchAll: ParamValue<true> }, { catchAll: ParamValue<false> }>,
    '/entities/': RouteRecordInfo<'/entities/', '/entities', Record<never, never>, Record<never, never>>,
    '/entities/[slug]': RouteRecordInfo<'/entities/[slug]', '/entities/:slug', { slug: ParamValue<true> }, { slug: ParamValue<false> }>,
    '/keep-supabase-alive': RouteRecordInfo<'/keep-supabase-alive', '/keep-supabase-alive', Record<never, never>, Record<never, never>>,
    '/login': RouteRecordInfo<'/login', '/login', Record<never, never>, Record<never, never>>,
    '/profiles/[username]': RouteRecordInfo<'/profiles/[username]', '/profiles/:username', { username: ParamValue<true> }, { username: ParamValue<false> }>,
    '/register': RouteRecordInfo<'/register', '/register', Record<never, never>, Record<never, never>>,
    '/settings/': RouteRecordInfo<'/settings/', '/settings', Record<never, never>, Record<never, never>>,
    '/sub-entities/[id]': RouteRecordInfo<'/sub-entities/[id]', '/sub-entities/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
  }
}
