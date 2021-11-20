import {Injectable} from '@nestjs/common';
import {S3Client, GetObjectCommand, GetObjectCommandInput} from "@aws-sdk/client-s3";
import {ConfigurationService} from "./configuration.service";

@Injectable()
export class FileService {
    private client: S3Client;

    constructor(
        private configurationService: ConfigurationService) {
        this.configurationService.getS3Client();
    }

    async get(bucket: string, filename: string): Promise<string> {
        const input: GetObjectCommandInput = {
            Bucket: bucket,
            Key: filename
        }
        const command = new GetObjectCommand(input);
        const response = await this.client.send(command);

        console.log(response);

        return "response";
    }
}
