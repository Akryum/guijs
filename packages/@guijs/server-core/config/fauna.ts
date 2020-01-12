// Fauna configuration object
// See https://fauna.github.io/faunadb-js/Client.html

import { ClientConfig } from 'faunadb'

export default {
  // See https://docs.fauna.com/fauna/current/security/index.html
  secret: process.env.GUIJS_FAUNA_SECRET || 'fnADh6NlfeACAJiswPrqmD5gU1FcaTDgZ1OaA1PX',
} as ClientConfig
