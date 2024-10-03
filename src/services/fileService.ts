import { S3Client, ListObjectsV2Command, HeadObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

class FileService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      ...(process.env.IS_OFFLINE ? { endpoint: 'http://localhost:4566', forcePathStyle: true } : {}),
    });
  }

  async listFiles(): Promise<string[]> {
    const command = new ListObjectsV2Command({ Bucket: process.env.BUCKET_NAME || 'local-bucket' });
    const result = await this.s3Client.send(command);
    return result.Contents?.map(file => file.Key || '') || [];
  }

  async getFileInfo(key: string): Promise<any> {
    const command = new HeadObjectCommand({ Bucket: process.env.BUCKET_NAME || 'local-bucket', Key: key });
    const result = await this.s3Client.send(command);
    return {
      name: key,
      size: result.ContentLength,
      lastModified: result.LastModified,
      contentType: result.ContentType,
    };
  }

  async getFile(key: string): Promise<Uint8Array> {
    const command = new GetObjectCommand({ Bucket: process.env.BUCKET_NAME || 'local-bucket', Key: key });
    const result = await this.s3Client.send(command);
    return result.Body?.transformToByteArray() || new Uint8Array();
  }

  async uploadFile(key: string, body: Buffer): Promise<void> {
    const command = new PutObjectCommand({ 
      Bucket: process.env.BUCKET_NAME || 'local-bucket', 
      Key: key, 
      Body: body 
    });
    await this.s3Client.send(command);
  }
}

export const fileService = new FileService();

