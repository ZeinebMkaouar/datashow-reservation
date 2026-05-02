import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { WeeksService } from './weeks.service';
import { CreateWeekDto } from './dto/create-week.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('weeks')
@UseGuards(JwtAuthGuard)
export class WeeksController {
  constructor(private weeksService: WeeksService) {}

  @Get()
  findAll() {
    return this.weeksService.findAll();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateWeekDto) {
    return this.weeksService.create(dto);
  }

  @Put(':id/toggle')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  toggle(@Param('id') id: string) {
    return this.weeksService.toggleOpen(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.weeksService.delete(id);
  }
}
