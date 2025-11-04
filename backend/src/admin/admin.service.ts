import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { CreatePizzaDto, UpdatePizzaDto } from './dto/pizza.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOrders() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        items: {
          include: {
            pizza: true,
          },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            pizza: true,
          },
        },
        address: true,
      },
    });
  }

  async getPizzas() {
    return this.prisma.pizza.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPizza(dto: CreatePizzaDto) {
    return this.prisma.pizza.create({
      data: dto,
    });
  }

  async updatePizza(id: string, dto: UpdatePizzaDto) {
    const pizza = await this.prisma.pizza.findUnique({
      where: { id },
    });

    if (!pizza) {
      throw new NotFoundException('Пицца не найдена');
    }

    return this.prisma.pizza.update({
      where: { id },
      data: dto,
    });
  }

  async deletePizza(id: string) {
    const pizza = await this.prisma.pizza.findUnique({
      where: { id },
    });

    if (!pizza) {
      throw new NotFoundException('Пицца не найдена');
    }

    await this.prisma.pizza.delete({
      where: { id },
    });

    return { message: 'Пицца успешно удалена' };
  }
}

