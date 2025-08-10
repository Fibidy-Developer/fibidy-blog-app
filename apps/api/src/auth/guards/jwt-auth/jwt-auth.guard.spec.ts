import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const mockReflector = {} as Reflector;
    const mockPrisma = {} as PrismaService;
    expect(new JwtAuthGuard(mockReflector, mockPrisma)).toBeDefined();
  });
});
