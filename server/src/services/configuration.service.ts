import {Injectable} from '@nestjs/common';
import {S3Client} from "@aws-sdk/client-s3";

const IAM_USER_KEY = " W7XE58Z1QL3RAHH0L12O";
const IAM_USER_SECRET = "r85dqpA45UuY7+FYp0GgPQWHGhPHWrfzYuG+NUe+";

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
