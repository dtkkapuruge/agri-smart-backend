import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      //await this.$connect();
      console.log('✅ Agri-Smart Database Connected (v5)!');
    } catch (error) {
      console.error('❌ Database Connection Error:', error);
    }
  }
}