import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('schedule')
  async getSchedule(@Request() req) {
    return this.usersService.getSchedule(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put('schedule')
  async updateSchedule(
    @Request() req,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.usersService.updateSchedule(req.user.sub, updateScheduleDto);
  }
}
