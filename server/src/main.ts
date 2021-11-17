import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from 'nestjs-pino';
import {isNullOrUndefined} from "util";

const signalsNames: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGHUP'];

async function bootstrap() {
    let port = process.env.SERVER_PORT;

    const app = await NestFactory.create(AppModule, {
        logger: false,
    });

    const logger = app.get(Logger);

    signalsNames.forEach(signalName =>
        process.on(signalName, signal => {
            logger.log(`Retrieved signal: ${signal}, application terminated`);
            process.exit(0);
        }),
    );

    process.on('uncaughtException', (error: Error) => {
        logger.error({err: error});
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        logger.error(`Unhandled Promise Rejection, reason: ${reason}`);
        promise.catch((err: Error) => {
            logger.error({err});
            process.exit(1);
        });
    });

    app.useLogger(logger);
    // app.disable('x-powered-by');
    await app.listen(port);

    const msg = `Started on port ${port}.`;
    logger.log(msg);
}

bootstrap().then(r => {
    if (isNullOrUndefined(r)) {
        return;
    }
    console.log(r)
});
