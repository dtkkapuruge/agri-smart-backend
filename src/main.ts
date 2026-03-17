import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Server එකට එන requests handle කරන්න මේක ඕනේ
    app.enableCors(); 

    await app.listen(3000);
    console.log(`🚀 Agri-Smart Backend is running on: http://localhost:3000`);
  } catch (error) {
    // මොකක් හරි Error එකක් ආවොත් ඒක මෙතනින් බලාගන්න පුළුවන්
    console.error("❌ Error starting application:", error);
  }
}
bootstrap();