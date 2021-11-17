import {Query, Controller, Get, HttpException, UseInterceptors} from '@nestjs/common';
import {DirectoryService} from './directory.service';
import {DirectoryListing} from "./types/directory-listing";

require('dotenv').config()

@Controller('/io/v1/')
export class AppController {
    constructor(private readonly directoryService: DirectoryService,
    ) {
    }

    @Get("listFiles")
    async listFiles(@Query('directory') directory: string): Promise<DirectoryListing> {
        if (!directory) {
            throw new HttpException("No directory requested.",400);
            // throw new Error("No directory requested.");
        }
        if (!await this.directoryService.exists(directory)) {
            throw new HttpException(`Directory ${directory} does not exist.`,400);
            // throw new Error(`Directory ${directory} does not exist.`);
        }


        return await this.directoryService.listFiles(directory);
    }
}
