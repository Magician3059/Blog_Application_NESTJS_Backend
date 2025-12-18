import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'reflect-metadata';

// Entry point function of nestjs application
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // create application using Appmodule(contains controllers , services,modules...)

  // app.useGlobalGuards(PermissionsGuard);

  console.log('DB HOST = ', process.env.DB_HOST);
  //-------------------------------------------------------------------------------------------------------------------------
  // whitelist: true → removes any extra/unexpected fields that are not defined in the DTO.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); //Adds a global Validation Pipe to validate incoming request DTOs.
  //With the auto-transformation option enabled, the ValidationPipe will also perform conversion of primitive types.
  // every path parameter and query parameter comes over the network as a string. In controller, we specified the id type as a number (in the method signature). Therefore, the ValidationPipe will try to automatically convert a string identifier to a number.

  app.useGlobalInterceptors(
    new ResponseTransformInterceptor(),
    new TimingInterceptor(),
  );

  // -------------------------------------------------
  // Upload File
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  // ---------------------------------------------------
  // Enable Global Mapper
  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(app.get(Reflector), { // Global interceptor : Work like Model Mapper
  //     excludeExtraneousValues: true,
  //   }),
  // );

  // Creates configuration for Swagger API documentation.
  const config = new DocumentBuilder()
    .setTitle('Blog Application ')
    .setDescription('Blogging API built with NestJS')
    .setVersion('1.0')
    .addBearerAuth(
      // add jwt : adds authentication header
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token', // MUST match ApiBearerAuth
    )
    .build(); // finalizes configuration.

  app.use((req, _, next) => {
    console.log('AUTH HEADER =>', req.headers.authorization);
    next();
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // -------------------------------------------------------------------------------------------------------------------------
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
