import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: string) {
    // Получаем пиццы для расчета общей стоимости
    const pizzas = await this.prisma.pizza.findMany({
      where: {
        id: { in: dto.items.map((item) => item.pizzaId) },
      },
    });

    if (pizzas.length !== dto.items.length) {
      throw new NotFoundException('Одна или несколько пицц не найдены');
    }

    // Рассчитываем общую стоимость
    const total = dto.items.reduce((sum, item) => {
      const pizza = pizzas.find((p) => p.id === item.pizzaId);
      return sum + pizza.price * item.quantity;
    }, 0);

    // Создаем заказ
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: dto.items.map((item) => {
            const pizza = pizzas.find((p) => p.id === item.pizzaId);
            return {
              pizzaId: item.pizzaId,
              quantity: item.quantity,
              price: pizza.price,
            };
          }),
        },
        ...(dto.address && {
          address: {
            create: dto.address,
          },
        }),
      },
      include: {
        items: {
          include: {
            pizza: true,
          },
        },
        address: true,
      },
    });

    return order;
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
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

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            pizza: true,
          },
        },
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этому заказу');
    }

    return order;
  }
}

