import {Injectable} from '@nestjs/common';
import {DirectoryListing} from "./types/directory-listing";
import {S3Client, ListObjectsCommand, ListObjectsCommandInput} from "@aws-sdk/client-s3";
import {InjectPinoLogger, PinoLogger} from "nestjs-pino";

const BUCKET_NAME = "test";
const IAM_USER_KEY = "9ATPR6VOSHB6UOHNYOU2";
const IAM_USER_SECRET = "cl2ngrliDemgR5bCHzkM2LEk0QSiGbP1Cd61YqQA";

@Injectable()
export class DirectoryService {
    private client: S3Client;

    constructor( @InjectPinoLogger(DirectoryService.name) private readonly logger: PinoLogger,) {

        this.client = new S3Client({
            region: "us-west-2",
            forcePathStyle: true,
            credentials: {
                accessKeyId: IAM_USER_KEY,
                secretAccessKey: IAM_USER_SECRET,
            },
            endpoint: 'http://192.168.73.58:9008',
        });

        this.logger.trace('DirectoryService created');
    }

    async exists(directory: string): Promise<boolean> {
        const content = await this.listFiles(directory);
        const cnt = content.files.filter(fileName => {
            return fileName.startsWith(directory);
        }).length;
        return cnt > 0;
    }

    async listFiles(directory: string): Promise<DirectoryListing> {
        const input: ListObjectsCommandInput = {
            Bucket: BUCKET_NAME,
        }
        const command = new ListObjectsCommand(input);
        const response = await this.client.send(command);

        const rc = new DirectoryListing();
        rc.name = directory;
        response.Contents.forEach(obj => {
            if (obj.Key.startsWith(directory)) {
                rc.files.push(obj.Key);
            }
        })

        return rc;
    }
}
