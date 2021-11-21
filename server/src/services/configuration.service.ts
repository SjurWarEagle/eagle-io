import {Injectable} from '@nestjs/common';
import {S3Client} from "@aws-sdk/client-s3";
require('dotenv').config()

const IAM_USER_KEY = process.env.MINIO_IAM_USER_KEY;
const IAM_USER_SECRET = process.env.MINIO_IAM_USER_SECRET;

@Injectable()
export class ConfigurationService {
    private client: S3Client;

    public getS3Client(): S3Client {

        if (!this.client) {
            this.client = new S3Client({
                region: "us-west-2",
                forcePathStyle: true,
                credentials: {
                    accessKeyId: IAM_USER_KEY,
                    secretAccessKey: IAM_USER_SECRET,
                },
                endpoint: process.env.MINIO_SERVER_URL,
            });
        }
        return this.client;
    }
}
