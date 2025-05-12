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
const seedDatabase = async ({ countProjects, countTasks, countRecords }) => {
  let userId

  const testUserId = await PrimaryTestUserExists()

  if (!testUserId) {
    const primaryTestUserId = await createPrimaryTestUser()
    userId = primaryTestUserId
  } else {
    userId = testUserId
  }
  const projects = (await seedProjects(countProjects)).map((entity) => {
    return { project_uid: entity.project_uid, project_name: entity.name }
  })
  const projectTaskUids = (await seedTasks(countTasks, projects)).map((entity) => {
    return { task_uid: entity.task_uid, project_uid: entity.project_uid }
  })
  await seedRecords(countRecords, projectTaskUids)
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
    const name = `Project ${i.toString().padStart(3, '0')}`
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

  const { data, error } = await supabase
    .from('projects')
    .insert(projects)
    .select('project_uid, name')

  if (error) return logErrorAndExit('Projects', error)

  logStep('Projects seeded successfully.')
  logStep('Returning following uuids:')
  logStep(data)

  return data
}

const seedTasks = async (numEntries, projects) => {
  logStep('Seeding tasks...')
  const tasks = []

  for (let i = 0; i < numEntries; i++) {
    const projectPicked = faker.helpers.arrayElement(projects)
    const name = `Task ${i.toString().padStart(4, '0')} of ${projectPicked.project_name}`
    const completed = faker.datatype.boolean()
    tasks.push({
      name: name,
      slug: name.toLocaleLowerCase().replace(/ /g, '-'),
      project_uid: projectPicked.project_uid,
      created_at: faker.date.past(),
      completed: completed,
      completed_at: completed ? faker.date.future() : null,
      updated_at: completed ? faker.date.future() : null,
    })
  }

  const { data, error } = await supabase.from('tasks').insert(tasks).select('task_uid, project_uid')

  if (error) return logErrorAndExit('Tasks', error)

  logStep('Tasks seeded successfully.')
  return data
}

const seedRecords = async (numEntries, projectTasksIds) => {
  logStep('Seeding records...')
  logStep('With existing project/task couples...')
  logStep(projectTasksIds)
  const records = []

  let previousStartedAt = null
  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3)
    const linkedToTask = faker.datatype.boolean()
    const projectTaskIdPicked = faker.helpers.arrayElement(projectTasksIds)
    logStep(`linkedToTask is <${linkedToTask}>`)
    logStep(`projectTaskIdPicked is <${JSON.stringify(projectTaskIdPicked)}>`)

    let endedAt, startedAt

    if (i === 0) {
      endedAt = new Date() // Current time for the first item
    } else {
      endedAt = previousStartedAt // Set to previous item's started_at
    }

    // Calculate started_at by subtracting random seconds from ended_at
    const randomSeconds = faker.number.int({ min: 60, max: 14400 }) // Between 1 minute and 1 day
    startedAt = new Date(endedAt.getTime() - randomSeconds * 1000)

    previousStartedAt = startedAt // Store for the next iteration

    records.push({
      project_uid: projectTaskIdPicked.project_uid,
      task_uid: linkedToTask ? projectTaskIdPicked.task_uid : null,
      started_at: startedAt,
      ended_at: endedAt,
      created_at: startedAt,
      updated_at: endedAt,
    })
  }
  logStep(`records are:`)
  logStep(records)
  const { data, error } = await supabase.from('records').insert(records).select('record_uid')

  if (error) return logErrorAndExit('Records', error)

  logStep('Records seeded successfully.')

  return data
}

seedDatabase({ countProjects: 100, countTasks: 1000, countRecords: 2500 })
