import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { DataShowsModule } from './datashows/datashows.module';
import { WeeksModule } from './weeks/weeks.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ClaimsModule } from './claims/claims.module';
import { RepairsModule } from './repairs/repairs.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    // Charge le fichier .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Connecte MongoDB en utilisant la variable d'environnement
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    // Enable cron jobs
    ScheduleModule.forRoot(),
    // Feature modules
    AuthModule,
    UsersModule,
    RoomsModule,
    DataShowsModule,
    WeeksModule,
    ReservationsModule,
    ClaimsModule,
    RepairsModule,
    SessionsModule,
  ],
})
export class AppModule {}