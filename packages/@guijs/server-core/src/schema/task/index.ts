import gql from 'graphql-tag'
import { Task, TaskStatus, Resolvers } from '@/generated/schema'
import Context from '@/generated/context'
import shortid from 'shortid'
import consola from 'consola'

export const typeDefs = gql`
type Task {
  id: ID!
  type: ID!
  payload: JSON
  status: TaskStatus!
  progress: Float
  message: String
}

enum TaskStatus {
  running
  success
  error
}

extend type Query {
  task (id: ID!): Task
  tasks: [Task!]!
}

extend type Subscription {
  taskAdded: Task!
  taskUpdated: Task!
}
`

export const tasks: Task[] = []

export interface TaskOptions {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
}

export function addTask (options: TaskOptions, ctx: Context) {
  const task: Task = {
    ...options,
    id: shortid(),
    status: TaskStatus.Running,
    progress: null,
    message: null,
  }
  tasks.push(task)

  ctx.pubsub.publish('taskAdded', {
    taskAdded: task,
  })

  return {
    task,
    setProgress: (progress: number) => setTaskProgress(task.id, progress, ctx),
    setStatus: (status: TaskStatus, message?: string) => setTaskStatus(task.id, status, message, ctx),
  }
}

export function setTaskProgress (id: string, progress: number, ctx: Context) {
  const task = tasks.find(t => t.id === id)
  task.progress = progress
  ctx.pubsub.publish('taskUpdated', {
    taskUpdated: task,
  })
  return task
}

export function setTaskStatus (id: string, status: TaskStatus, message: string, ctx: Context) {
  const task = tasks.find(t => t.id === id)
  task.status = status
  task.message = message
  ctx.pubsub.publish('taskUpdated', {
    taskUpdated: task,
  })
  return task
}

export interface TaskApi {
  setProgress?: (progress: number) => void
}

export function executeTask (options: TaskOptions, func: (api?: TaskApi) => Promise<void>, ctx: Context) {
  const { task, setProgress, setStatus } = addTask(options, ctx)
  // Execute task in background
  ;(async () => {
    try {
      await func({
        setProgress,
      })
      setStatus(TaskStatus.Success)
    } catch (e) {
      consola.error(`Task ${options.type} failed`, e.message)
      setStatus(TaskStatus.Error, e.message)
    }
  })()
  return task
}

export const resolvers: Resolvers = {
  Query: {
    task: (root, { id }) => tasks.find(t => t.id === id),

    tasks: () => tasks,
  },

  Subscription: {
    taskAdded: {
      subscribe: (root, args, ctx) => ctx.pubsub.asyncIterator(['taskAdded']),
    },
    taskUpdated: {
      subscribe: (root, args, ctx) => ctx.pubsub.asyncIterator(['taskUpdated']),
    },
  },
}
