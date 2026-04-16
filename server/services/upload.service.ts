import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@/server/config/env'
import { AppError } from '@/server/lib/errors'

const s3 =
  env.AWS_REGION && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
    ? new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      })
    : null

export const uploadService = {
  async createSignedUploadUrl(key: string, contentType: string) {
    if (!s3 || !env.AWS_S3_BUCKET) {
      throw new AppError('S3 is not configured', 500, 'UPLOAD_NOT_CONFIGURED')
    }

    return getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: 300 },
    )
  },
}
