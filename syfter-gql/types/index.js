import fs from 'fs'
import { Resolver } from './query/resolver.js'
import Mutation from './mutation/resolver.js'
import { dirname } from 'path'
const __dirname = dirname(import.meta.url).replace('file://', '')
import readdir from 'recursive-readdir-sync'


export const Schema = readdir(__dirname)
  .filter((f) => f.endsWith('.gql'))
  .reduce((schema, f) => schema + fs.readFileSync(f), '')

console.log(Schema)

export const Resolvers = {
    Query: new Resolver(),
    Mutation: new Mutation()
}