// to internationlize the faked data, use the XX_ZZ local
// and import fake like the comment below
// import { fakerFR_BE as faker } from '@faker-js/faker'
import { da, faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

console.log('import.meta.env', import.meta.env)
console.log('process.env', process.env)
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PROJECT_SERVICE_ROLE

// console.log('supabaseUrl', supabaseUrl)
// console.log('supabaseKey', supabaseKey)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PROJECT_SERVICE_ROLE,
)

const testingUserEmail = process.env.VITE_TESTING_USER_EMAIL
if (!testingUserEmail) {
  console.error('Have you forgot to add VITE_TESTING_USER_EMAIL to your .env file?')
  process.exit()
}

const logErrorAndExit = (tableName, error) => {
  console.error(
    `An error occurred in table '${tableName}' with code ${error.code}: ${error.message}`,
  )
  process.exit(1)
}

const logStep = (stepMessage) => {
  console.log(stepMessage)
}

const PrimaryTestUserExists = async () => {
  logStep('Checking if primary test user exists...')
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', 'testaccount1')
    .single()

  if (error) {
    console.log('Primary test user not found. Will create one.')
    return false
  }

  logStep('Primary test user is found.')
  return data?.id
}

const createPrimaryTestUser = async () => {
  logStep('Creating primary test user...')
  const dummyData = {
    firstName: 'Test',
    lastName: 'Account',
    userName: 'testaccount1',
    email: testingUserEmail,
    userId: null,
  }
  const { data, error } = await supabase.auth.signUp({
    email: dummyData.email,
    password: dummyData.email,
    options: {
      data: {
        first_name: dummyData.firstName,
        last_name: dummyData.lastName,
        full_name: dummyData.firstName + ' ' + dummyData.lastName,
        username: dummyData.userName,
      },
      //uncomment below if you don't get the Supabase confirmation email
      // email_confirmed_at: new Date(Date.now())
    },
  })

  if (error) {
    logErrorAndExit('Users', error)
  }

  if (data) {
    dummyData.userId = data.user.id
    await seedProfiles(dummyData)
    return data.user.id
  }
}
const seedProfiles = async ({ userId, firstName, lastName, userName }) => {
  await supabase.from('profiles').insert({
    id: userId,
    full_name: firstName + ' ' + lastName,
    username: userName,
    bio: 'The main testing account',
    avatar_url: `https://i.pravatar.cc/150?u=${userId}`,
  })

  logStep(`Primary test user <${userId}> created successfully.`)
}
const seedDatabase = async (numEntriesPerTable) => {
  let userId

  const testUserId = await PrimaryTestUserExists()

  if (!testUserId) {
    const primaryTestUserId = await createPrimaryTestUser()
    userId = primaryTestUserId
  } else {
    userId = testUserId
  }
  const projectsIds = (await seedProjects(numEntriesPerTable)).map((entity) => entity.project_uid)
  const taskIds = (await seedTasks(numEntriesPerTable, projectsIds)).map(
    (entity) => entity.task_uid,
  )
  await seedRecords(numEntriesPerTable, projectsIds, taskIds)
  await seedKeepAlive()
}

const seedKeepAlive = async () => {
  const { data, error } = await supabase
    .from('keep_alive')
    .insert({ is_set: true })
    .select('is_set')

  if (error) return logErrorAndExit('keep_alive has an error', error)
  if (!data) return logErrorAndExit('keep_alive has no data', data)

  logStep('Seeded keep_alive!')
}
const seedProjects = async (numEntries) => {
  logStep('Seeding projects...')
  const projects = []

  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3)
    const archived = faker.datatype.boolean()

    projects.push({
      name: name,
      slug: name.toLocaleLowerCase().replace(/ /g, '-'),
      hex_color: faker.color.rgb({ casing: 'lower' }),
      created_at: faker.date.past(),
      archived: archived,
      archived_at: archived ? faker.date.future() : null,
    })
  }

  const { data, error } = await supabase.from('projects').insert(projects).select('project_uid')

  if (error) return logErrorAndExit('Projects', error)

  logStep('Projects seeded successfully.')
  logStep('Returning following uuids:')
  logStep(data)

  return data
}

const seedTasks = async (numEntries, projectIds) => {
  logStep('Seeding tasks...')
  const tasks = []

  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3)
    const completed = faker.datatype.boolean()
    tasks.push({
      name: name,
      slug: name.toLocaleLowerCase().replace(/ /g, '-'),
      project_uid: faker.helpers.arrayElement(projectIds),
      created_at: faker.date.past(),
      completed: completed,
      completed_at: completed ? faker.date.future() : null,
      updated_at: completed ? faker.date.future() : null,
    })
  }

  const { data, error } = await supabase.from('tasks').insert(tasks).select('task_uid')

  if (error) return logErrorAndExit('Tasks', error)

  logStep('Tasks seeded successfully.')

  return data
}

const seedRecords = async (numEntries, projectIds, taskIds) => {
  logStep('Seeding records...')
  logStep('with existing projects...')
  logStep(projectIds)
  logStep('With existing tasks...')
  logStep(taskIds)
  const records = []

  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3)
    const linkedToTask = faker.datatype.boolean()
    const taskIdPicked = faker.helpers.arrayElement(taskIds)
    logStep(`linkedToTask is <${linkedToTask}>`)
    logStep(`taskIdPicked is <${taskIdPicked}>`)
    records.push({
      project_uid: faker.helpers.arrayElement(projectIds),
      task_uid: linkedToTask ? taskIdPicked : null,
      started_at: faker.date.past(),
      ended_at: faker.date.soon(),
      created_at: faker.date.past(),
      updated_at: faker.date.soon(),
    })
  }
  logStep(`records are:`)
  logStep(records)
  const { data, error } = await supabase.from('records').insert(records).select('record_uid')

  if (error) return logErrorAndExit('Records', error)

  logStep('Records seeded successfully.')

  return data
}

const numEntriesPerTable = 10

seedDatabase(numEntriesPerTable)
