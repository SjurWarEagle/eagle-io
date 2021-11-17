import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {DirectoryService} from './directory.service';
import {LoggerModule} from "nestjs-pino";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'trace' : 'info',
        prettyPrint: process.env.NODE_ENV !== 'production',
        useLevelLabels: true,
      },
    }),
        ],
  controllers: [AppController],
  providers: [DirectoryService],
})
export class AppModule {}
