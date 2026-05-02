import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { DataShowsService } from './datashows.service';
import { CreateDataShowDto } from './dto/create-datashow.dto';
import { UpdateDataShowDto } from './dto/update-datashow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('datashows')
@UseGuards(JwtAuthGuard)
export class DataShowsController {
  constructor(private dataShowsService: DataShowsService) {}

  @Get()
  findAll(@Query('etat') etat?: string) {
    return this.dataShowsService.findAll(etat);
  }

  @Get('available')
  findAvailable() {
    return this.dataShowsService.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataShowsService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateDataShowDto) {
    return this.dataShowsService.create(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateDataShowDto) {
    return this.dataShowsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.dataShowsService.delete(id);
  }
}
