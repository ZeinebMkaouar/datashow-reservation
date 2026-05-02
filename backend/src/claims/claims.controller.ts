import {
  Controller, Get, Post, Put,
  Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { ResolveClaimDto } from './dto/resolve-claim.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('claims')
@UseGuards(JwtAuthGuard)
export class ClaimsController {
  constructor(private claimsService: ClaimsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateClaimDto) {
    return this.claimsService.create(req.user.sub, dto);
  }

  @Get('my')
  findMy(@Request() req) {
    return this.claimsService.findByProfessor(req.user.sub);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.claimsService.findAll();
  }

  @Put(':id/resolve')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  resolve(@Param('id') id: string, @Body() dto: ResolveClaimDto) {
    return this.claimsService.resolve(id, dto);
  }
}
