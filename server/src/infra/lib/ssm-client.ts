import { SSMClient } from '@aws-sdk/client-ssm'

export const client = new SSMClient({ region: 'us-east-2' })
