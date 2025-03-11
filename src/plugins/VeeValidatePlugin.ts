import { type App } from 'vue'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, url, min, between, length, max, regex } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import { en } from '@/i18n/vee-validate-en'
import { fr } from '@/i18n/vee-validate-fr'
import { taskSlugForProjectAvailable } from '@/services/supabase-tasks-queries'
import type { UniqueConstraintTask } from '@/types/UniqueTaskConstraint'
import { projectSlugAvailable } from '@/services/supabase-projects-queries'

interface UniqueRuleArgs {
  prop: string
  excluding: string
}

const veeValidatePlugin = {
  install(app: App) {
    defineRule('required', required)
    defineRule('between', between)
    defineRule('length', length)
    defineRule('email', email)
    defineRule('url', url)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('regex', regex)
    defineRule('uniqueSlugProject', async (value: string) => {
      // console.log('veeValidatePlugin > uniqueSlugTask', value, args)
      const result = await projectSlugAvailable(value)
      return result
    })
    defineRule('uniqueSlugTask', async (value: string, args: UniqueConstraintTask) => {
      // console.log('veeValidatePlugin > uniqueSlugTask', value, args)
      const result = await taskSlugForProjectAvailable({ projectUid: args.projectUid, slug: value })
      return result
    })

    configure({
      generateMessage: localize({
        // use `setLocale('fr');` to change the validation messages
        // see https://vee-validate.logaretm.com/v4/guide/i18n/
        en,
        fr,
      }),
    })

    app.component('VeeForm', Form)
    app.component('VeeField', Field)
    app.component('VeeErrorMessage', ErrorMessage)
  },
}

export default veeValidatePlugin
