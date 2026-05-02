import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Week, WeekSchema } from './week.schema';
import { WeeksService } from './weeks.service';
import { WeeksController } from './weeks.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Week.name, schema: WeekSchema }]),
  ],
  controllers: [WeeksController],
  providers: [WeeksService],
  exports: [WeeksService],
})
export class WeeksModule {}
