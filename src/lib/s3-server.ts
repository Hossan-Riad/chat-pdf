import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { Readable } from "stream"; // Import Readable for stream handling

export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3Client = new S3Client({
        region: "eu-north-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      };

      const response = await s3Client.send(new GetObjectCommand(params));

      const file_name = `/tmp/pdf-${Date.now()}.pdf`;
      const writeStream = fs.createWriteStream(file_name); // Create a writable stream

      // Cast response.Body to Readable
      const stream = response.Body as Readable; 
      
      // Pipe the readable stream into the writable stream
      stream.pipe(writeStream);

      // Resolve the promise when the write is complete
      writeStream.on('finish', () => resolve(file_name));
      writeStream.on('error', (err) => reject(err));

    } catch (error) {
      console.error(error);
      reject(error); // Reject on error
    }
  });
}