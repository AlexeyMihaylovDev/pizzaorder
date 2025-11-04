import { Controller, Get, Patch, Param, Body, UseGuards, Post, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreatePizzaDto, UpdatePizzaDto } from './dto/pizza.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('orders')
  getOrders() {
    return this.adminService.getOrders();
  }

  @Patch('orders/:id')
  updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.adminService.updateOrderStatus(id, dto.status);
  }

  @Get('pizzas')
  getPizzas() {
    return this.adminService.getPizzas();
  }

  @Post('pizzas')
  createPizza(@Body() dto: CreatePizzaDto) {
    return this.adminService.createPizza(dto);
  }

  @Patch('pizzas/:id')
  updatePizza(@Param('id') id: string, @Body() dto: UpdatePizzaDto) {
    return this.adminService.updatePizza(id, dto);
  }

  @Delete('pizzas/:id')
  deletePizza(@Param('id') id: string) {
    return this.adminService.deletePizza(id);
  }
}

