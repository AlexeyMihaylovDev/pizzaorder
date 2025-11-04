import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PizzasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pizza.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pizza = await this.prisma.pizza.findUnique({
      where: { id },
    });

    if (!pizza) {
      throw new NotFoundException('Пицца не найдена');
    }

    return pizza;
  }
}

