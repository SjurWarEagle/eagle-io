import {Query, Controller, Get, Body, Post} from '@nestjs/common';
import {DirectoryService} from '../services/directory.service';
import {WriteFileRequest} from "../types/write-file-request";
import {GetObjectCommand, GetObjectCommandInput, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {ConfigurationService} from "../services/configuration.service";
import {PutObjectCommandInput} from "@aws-sdk/client-s3/dist-types/commands/PutObjectCommand";
import {Readable} from "stream";

require('dotenv').config()

@Controller('/io/v1/files')
export class FilesController {
    private client: S3Client;

    constructor(private readonly directoryService: DirectoryService,
                private configurationService: ConfigurationService
    ) {
        this.client = this.configurationService.getS3Client();
    }

    private async streamToString (stream: Readable): Promise<string> {
        return await new Promise((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        });
    }

    @Get("read")
    async readFile(@Query('bucket') bucket: string,@Query('file') fileName: string): Promise<string> {
        // if (!directory) {
        //     throw new HttpException("No directory requested.",400);
        //     // throw new Error("No directory requested.");
        // }
        // if (!await this.directoryService.exists(directory)) {
        //     throw new HttpException(`Directory ${directory} does not exist.`,400);
        //     // throw new Error(`Directory ${directory} does not exist.`);
        // }
        //
        const input:GetObjectCommandInput={
            Bucket:bucket,
            Key: fileName,
        };
        const command = new GetObjectCommand(input);
        const response = await this.client.send(command);
        const contentAsString = await this.streamToString(response.Body as Readable);
        console.log(contentAsString);

        return contentAsString;
    }

    @Post("write")
    async writeFile(@Body() body: WriteFileRequest): Promise<void> {
        // if (!directory) {
        //     throw new HttpException("No directory requested.",400);
        //     // throw new Error("No directory requested.");
        // }
        // if (!await this.directoryService.exists(directory)) {
        //     throw new HttpException(`Directory ${directory} does not exist.`,400);
        //     // throw new Error(`Directory ${directory} does not exist.`);
        // }
        //
        console.log('body',body);
        const input:PutObjectCommandInput={
            Bucket: body.bucket,
            Key: body.fileName,
            Body:body.content
        };
        const command = new PutObjectCommand(input);
        const response = await this.client.send(command);
        console.log(response);
    }
}
