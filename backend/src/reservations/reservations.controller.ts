import {
  Controller, Get, Post, Put,
  Body, Param, Query, Request, UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Seance } from './reservation.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  /**
   * GET /reservations/suggestion?date=2026-04-28
   * Returns pre-fill suggestions from the professor's schedule.
   */
  @Get('suggestion')
  getSuggestion(@Request() req, @Query('date') date: string) {
    return this.reservationsService.getSuggestion(req.user.sub, date);
  }

  /**
   * GET /reservations/available?date=2026-04-28&seance=S2
   * Returns DataShows available for that date+seance.
   */
  @Get('available')
  getAvailable(
    @Query('date') date: string,
    @Query('seance') seance: Seance,
  ) {
    return this.reservationsService.getAvailableDataShows(date, seance);
  }

  /**
   * GET /reservations/my
   * Returns the current professor's reservations.
   */
  @Get('my')
  findMy(@Request() req) {
    return this.reservationsService.findByProfessor(req.user.sub);
  }

  /**
   * GET /reservations/all (Admin only)
   * Returns all reservations across all professors.
   */
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.reservationsService.findAll();
  }

  /**
   * POST /reservations
   * Creates a new reservation with all constraint checks.
   */
  @Post()
  create(@Request() req, @Body() dto: CreateReservationDto) {
    return this.reservationsService.create(req.user.sub, dto);
  }

  /**
   * PUT /reservations/:id/cancel
   * Cancels a reservation (professor can only cancel their own).
   */
  @Put(':id/cancel')
  cancel(@Request() req, @Param('id') id: string) {
    return this.reservationsService.cancel(id, req.user.sub);
  }
}
