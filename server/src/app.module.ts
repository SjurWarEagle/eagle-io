import {Module} from '@nestjs/common';
import {DirectoryController} from './controllers/directory-controller';
import {DirectoryService} from './services/directory.service';
import {FileService} from "./services/file.service";
import {ConfigurationService} from "./services/configuration.service";
import {FilesController} from "./controllers/files.controller";

@Module({
    imports: [
    ],
    controllers: [
        DirectoryController,
        FilesController,
    ],
    providers: [
        DirectoryService,
        FileService,
        ConfigurationService,
    ],
})
export class AppModule {
}
