import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    credentials: true,
    origin: '*',
  });

  await app.listen(process.env.PORT || 3001, (err, appUri) => {
    if (err) {
      console.error(err);
      return;
    }
    const logger = new Logger();
    logger.log(`Server started at ${appUri}`);
    logger.log(`GraphQL URL started at ${appUri}/graphql`);
  });
}
bootstrap();
