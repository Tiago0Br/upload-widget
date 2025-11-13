import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

export const secretsManagerClient = new SecretsManagerClient({ region: 'us-east-2' })
