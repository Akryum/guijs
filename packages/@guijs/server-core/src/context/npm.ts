import { onCreate, addProp } from '@nodepack/app-context'
import npmFetch, { Options } from 'npm-registry-fetch'
import Context from '@/generated/context'

type NpmFunction = (url: string, opts?: Options) => Promise<any>

onCreate(async (context: Context) => {
  addProp(context, 'npm', () => npmFetch.json)
  addProp(context, 'npmApi', () => (url: string, opts: any = undefined) => npmFetch.json(`https://api.npmjs.org/${url}`, opts))
})

export default interface NpmContext {
  npm: NpmFunction
  npmApi: NpmFunction
}
