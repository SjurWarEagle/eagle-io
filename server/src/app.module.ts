import {Module} from '@nestjs/common';
import {DirectoryController} from './controllers/directory-controller';
import {DirectoryService} from './services/directory.service';
import {FileService} from "./services/file.service";
import {ConfigurationService} from "./services/configuration.service";
import {FilesController} from "./controllers/files.controller";
import {RolesGuard} from "./auth/roles.guard";
import {APP_GUARD} from "@nestjs/core";

@Module({
    imports: [
    ],
    controllers: [
        DirectoryController,
        FilesController,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        DirectoryService,
        FileService,
        ConfigurationService,
    ],
})
export class AppModule {
}
