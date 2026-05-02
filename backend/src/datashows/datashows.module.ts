import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataShow, DataShowSchema } from './datashow.schema';
import { DataShowsService } from './datashows.service';
import { DataShowsController } from './datashows.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DataShow.name, schema: DataShowSchema }]),
  ],
  controllers: [DataShowsController],
  providers: [DataShowsService],
  exports: [DataShowsService, MongooseModule],
})
export class DataShowsModule {}
