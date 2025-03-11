import type { IFormDataCreateBase } from '@/types/IFormDataCreateBase'
import { slugify } from '@/utils/slugify'

export const useSlug = (form: MaybeRefOrGetter<IFormDataCreateBase>) => {
  const _form = toRef(form)
  const slug = ref('')
  let _userEditedSlug = ref(false)

  const updateSlug = () => {
    if (!_form.value?.name) return
    if (!_userEditedSlug.value) {
      slug.value = slugify(_form.value.name)
    }
  }
  const enterSlugEditing = () => (_userEditedSlug.value = true)
  const exitSlugEditing = () => {
    const computedSlug = slugify(_form.value.name)
    if (slug.value === '') {
      _userEditedSlug.value = false
    } else if (slug.value !== computedSlug) {
      // since the slug is different from the computed slug from name
      // the auto computation of the slug is disabled
      _userEditedSlug.value = true
      return
    } else {
      // since the slug is the same from the computed slug from name
      // the auto computation of the slug is enabled
      _userEditedSlug.value = false
      return
    }
  }

  return {
    slug,
    enterSlugEditing,
    exitSlugEditing,
    updateSlug,
  }
}
