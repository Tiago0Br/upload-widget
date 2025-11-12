import { env } from '@/env'
import Vault from 'node-vault'

const options: Vault.VaultOptions = {
  apiVersion: env.SECRET_API_VERSION,
  endpoint: env.SECRET_API_ENDPOINT,
  token: env.SECRET_API_TOKEN,
}

export const vault = Vault(options)
