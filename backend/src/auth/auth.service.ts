import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
// import * as bcrypt from 'bcrypt';

// Se necessário, importe o Enum gerado pelo Prisma para garantir tipagem,
// mas passar a string geralmente funciona se for válida.
import { UserRole } from '../../prisma/generated/client'; // Ajuste o caminho conforme sua estrutura gerada

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(registerUserDto: RegisterUserDto) {
    // 1. Extrair 'role' do DTO
    const { name, email, password, phone, role } = registerUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException('Email já cadastrado', HttpStatus.CONFLICT);
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;

    // 2. Usar a variável role ou o padrão 'client'
    // Converter a string para o tipo UserRole do Prisma
    const userRole = (role as UserRole) || UserRole.client;

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        phone,
        role: userRole, // Usar o valor dinâmico
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return {
      message: 'Usuário registrado com sucesso',
      user: newUser,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    // In a real application, you would compare the hashed password
    // const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    const isPasswordValid = user.passwordHash === password; // Mocking password comparison

    if (!isPasswordValid) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    // Mocking a successful login
    return {
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: 'mocked-jwt-token', // Mocked JWT token
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
