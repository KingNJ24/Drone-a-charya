import { MongoClient, ServerApiVersion } from 'mongodb'

const dbName = process.env.MONGODB_DB || 'drone_a_charya'

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise:
    | {
        uri: string
        promise: Promise<MongoClient>
      }
    | undefined
}

const getClientPromise = () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise || global._mongoClientPromise.uri !== uri) {
      const client = new MongoClient(uri, options)
      global._mongoClientPromise = { uri, promise: client.connect() }
    }
    return global._mongoClientPromise.promise
  }

  const client = new MongoClient(uri, options)
  return client.connect()
}

export async function getDb() {
  const connectedClient = await getClientPromise()
  return connectedClient.db(dbName)
}
