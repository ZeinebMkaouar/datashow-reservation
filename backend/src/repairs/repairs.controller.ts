import {
  Controller, Get, Post, Put,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('repairs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class RepairsController {
  constructor(private repairsService: RepairsService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.repairsService.findAll(search);
  }

  @Get('datashow/:datashowId')
  findByDataShow(@Param('datashowId') datashowId: string) {
    return this.repairsService.findByDataShow(datashowId);
  }

  @Post()
  create(@Body() dto: CreateRepairDto) {
    return this.repairsService.create(dto);
  }

  @Put(':id/done')
  markDone(@Param('id') id: string) {
    return this.repairsService.markDone(id);
  }
}
