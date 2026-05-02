import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './reservation.schema';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { WeeksModule } from '../weeks/weeks.module';
import { DataShowsModule } from '../datashows/datashows.module';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    WeeksModule,
    DataShowsModule,
    RoomsModule,
    UsersModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
