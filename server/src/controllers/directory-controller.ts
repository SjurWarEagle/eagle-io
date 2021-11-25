import {Headers, Query, Controller, Get, HttpException} from '@nestjs/common';
import {DirectoryService} from '../services/directory.service';
import {DirectoryListing} from "../types/directory-listing";
import {Role} from "../auth/role.enum";
import {Roles} from "../auth/roles.decorator";

require('dotenv').config()

@Controller('/io/v1/directory')
export class DirectoryController {
    constructor(private readonly directoryService: DirectoryService,
    ) {
    }

    @Get("listFiles")
    async listFiles(@Query('bucket') bucket: string, @Query('directory') directory: string): Promise<DirectoryListing> {
        if (!bucket) {
            throw new HttpException("No bucket requested.", 400);
        }
        if (!directory) {
            throw new HttpException("No directory requested.", 400);
        }
        if (!await this.directoryService.exists(bucket, directory)) {
            throw new HttpException(`Directory ${directory} does not exist.`, 400);
            // throw new Error(`Directory ${directory} does not exist.`);
        }

        return await this.directoryService.listFiles(bucket, directory);
    }

    @Get("listAll")
    async listAllFiles(@Query('bucket') bucket: string, @Headers() headers): Promise<DirectoryListing> {
        // console.log('listAllFiles');
        // console.log(headers);
        if (!bucket) {
            throw new HttpException("No bucket requested.", 400);
        }

        return await this.directoryService.listAllFiles(bucket);
    }
}
