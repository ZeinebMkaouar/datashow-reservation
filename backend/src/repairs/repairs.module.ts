import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Repair, RepairSchema } from './repair.schema';
import { RepairsService } from './repairs.service';
import { RepairsController } from './repairs.controller';
import { DataShowsModule } from '../datashows/datashows.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Repair.name, schema: RepairSchema }]),
    DataShowsModule,
    ReservationsModule,
    NotificationsModule,
  ],
  controllers: [RepairsController],
  providers: [RepairsService],
  exports: [RepairsService],
})
export class RepairsModule {}
