import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PizzasService } from './pizzas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pizzas')
export class PizzasController {
  constructor(private pizzasService: PizzasService) {}

  @Get()
  findAll() {
    return this.pizzasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pizzasService.findOne(id);
  }
}

