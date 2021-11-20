import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
    let port = process.env.SERVER_PORT;

    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(port);

    console.log(`Started on port ${port}.`);
}

bootstrap();
