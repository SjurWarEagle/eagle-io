import {Injectable} from '@nestjs/common';
import {DirectoryListing} from "../types/directory-listing";
import {S3Client, ListObjectsCommand, ListObjectsCommandInput} from "@aws-sdk/client-s3";
import {ConfigurationService} from "./configuration.service";

@Injectable()
export class DirectoryService {
    private client: S3Client;

    constructor(private configurationService: ConfigurationService) {
        this.client = this.configurationService.getS3Client();
    }

    async exists(bucket: string, directory: string): Promise<boolean> {
        const content = await this.listFiles(bucket, directory);
        const cnt = content.files.filter(fileName => {
            return fileName.startsWith(directory);
        }).length;
        return cnt > 0;
    }

    async listFiles(bucket: string, directory: string): Promise<DirectoryListing> {
        const input: ListObjectsCommandInput = {
            Bucket: bucket,
        }
        const command = new ListObjectsCommand(input);
        const response = await this.client.send(command);

        const rc = new DirectoryListing();
        // console.log('rc', rc);
        rc.name = directory;
        response.Contents.forEach(obj => {
            if (obj.Key.startsWith(directory)) {
                rc.files.push(obj.Key);
            }
        })

        return rc;
    }

    async listAllFiles(bucket: string): Promise<DirectoryListing> {
        const input: ListObjectsCommandInput = {
            Bucket: bucket,
        }
        const command = new ListObjectsCommand(input);
        const response = await this.client.send(command);

        const rc = new DirectoryListing();
        // console.log('rc', rc);
        rc.name = "";
        response.Contents.forEach(obj => {
            rc.files.push(obj.Key);
        })

        return rc;
    }
}
