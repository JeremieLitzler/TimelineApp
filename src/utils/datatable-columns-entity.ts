import { RouterLink } from 'vue-router'
import type { ColumnDef } from '@tanstack/vue-table'
import AppInputLiveEditStatus from '@/components/AppInputLiveEditStatus.vue'
import { RouterPathEnum } from '@/types/RouterPathEnum'
import type { ProjectRecordWithRpc } from '@/types/ProjectRecordWithRpc'

export const columns: ColumnDef<ProjectRecordWithRpc>[] = [
  {
    accessorKey: 'project_name',
    header: () => h('div', { class: 'text-left' }, 'Name'),
    cell: ({ row }) => {
      // When using render functions, the way we pass children to elements is different than passing them to a custom component.
      // With elements, we can pass them straightaway to the h() function like so:
      // - h("p", "I'm text inside a paragraph tag").
      // - h("p", { class: "example-class" } ,"I'm text inside a paragraph tag").
      //
      // While with custom components, we must pass them as functions:
      // - h(CustomComponent, () => "I'm text inside a custom component").
      // - h(CustomComponent, { class: "example-class" } ,() => "I'm text inside a custom component").
      //
      // You can read more about it in the official docs: https://vuejs.org/guide/extras/render-function#passing-slots
      return h(
        RouterLink,
        {
          to: `${RouterPathEnum.Projects}/${row.original.project_slug}`,
          class: 'text-left underline hover:bg-muted block w-full font-medium',
        },
        () => row.getValue('project_name'),
      )
    },
  },
  {
    accessorKey: 'project_archived',
    header: () => h('div', { class: 'text-left' }, 'Status'),
    cell: ({ row }) => {
      return h(AppInputLiveEditStatus, {
        modelValue: row.original.project_archived,
        readonly: true,
        showToolTip: false,
        pointer: false,
      })
    },
  },
]
