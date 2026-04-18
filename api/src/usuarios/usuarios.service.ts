import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { InMemoryDataService } from '../storage/in-memory-data.service';

@Injectable()
export class UsuariosService {
  constructor(private readonly data: InMemoryDataService) {
    if (!this.data.users.length) {
      this.data.users.push(
        {
          id_usuario: this.data.nextId('user'),
          nome: 'Admin SportX',
          email: 'admin@sportx.com',
          senha: this.hashPassword('Admin@123'),
          tipo_usuario: 'admin',
          vendedor_bloqueado: false,
          cpf_bloqueado_venda: false,
          media_avaliacao_vendedor: 0,
          total_avaliacoes_vendedor: 0,
          data_criacao: new Date(),
        } as Usuario,
        {
          id_usuario: this.data.nextId('user'),
          nome: 'Vendedor Demo',
          email: 'vendedor@sportx.com',
          senha: this.hashPassword('Seller@123'),
          tipo_usuario: 'vendedor',
          cpf: '529.982.247-25',
          data_nascimento: '1990-01-20',
          vendedor_bloqueado: false,
          cpf_bloqueado_venda: false,
          media_avaliacao_vendedor: 4.8,
          total_avaliacoes_vendedor: 17,
          data_criacao: new Date(),
        } as Usuario,
      );
    }
  }

  async findAll(): Promise<Omit<Usuario, 'senha'>[]> {
    const usuarios = [...this.data.users].sort((a, b) => a.id_usuario - b.id_usuario);
    return usuarios.map((usuario) => this.sanitizeUser(usuario));
  }

  async findOne(id: number): Promise<Omit<Usuario, 'senha'>> {
    const usuario = this.data.users.find((item) => item.id_usuario === id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return this.sanitizeUser(usuario);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.data.users.find((item) => item.email === email.toLowerCase()) || null;
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
    const existe = await this.findByEmail(createUsuarioDto.email);
    if (existe) throw new ConflictException('Email já cadastrado');

    if (createUsuarioDto.tipo_usuario === 'vendedor') {
      await this.validateSellerEligibility(createUsuarioDto.cpf, createUsuarioDto.data_nascimento);
    }

    const usuario: Usuario = {
      id_usuario: this.data.nextId('user'),
      nome: createUsuarioDto.nome,
      cpf: this.normalizeCpf(createUsuarioDto.cpf),
      senha: this.hashPassword(createUsuarioDto.senha),
      email: createUsuarioDto.email.toLowerCase(),
      tipo_usuario: createUsuarioDto.tipo_usuario ?? 'cliente',
      data_nascimento: createUsuarioDto.data_nascimento,
      vendedor_bloqueado: false,
      cpf_bloqueado_venda: false,
      media_avaliacao_vendedor: 0,
      total_avaliacoes_vendedor: 0,
      motivo_bloqueio: '',
      data_criacao: new Date(),
    } as Usuario;

    this.data.users.push(usuario);
    return this.sanitizeUser(usuario);
  }

  async login(email: string, senha: string): Promise<Usuario> {
    const usuario = await this.findByEmail(email);
    if (!usuario || !this.verifyPassword(senha, usuario.senha)) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    if (usuario.tipo_usuario === 'vendedor') {
      await this.validateSellerEligibility(usuario.cpf, usuario.data_nascimento, usuario.id_usuario);
      if (usuario.vendedor_bloqueado) {
        throw new UnauthorizedException(
          usuario.motivo_bloqueio || 'Conta de vendedor bloqueada por baixa avaliação',
        );
      }
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
    const usuario = this.data.users.find((item) => item.id_usuario === id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      const existe = await this.findByEmail(updateUsuarioDto.email);
      if (existe) throw new ConflictException('Email já cadastrado');
    }

    if ((updateUsuarioDto.tipo_usuario || usuario.tipo_usuario) === 'vendedor') {
      await this.validateSellerEligibility(
        updateUsuarioDto.cpf ?? usuario.cpf,
        updateUsuarioDto.data_nascimento ?? usuario.data_nascimento,
        usuario.id_usuario,
      );
    }

    Object.assign(usuario, {
      ...updateUsuarioDto,
      cpf: this.normalizeCpf(updateUsuarioDto.cpf ?? usuario.cpf),
      email: updateUsuarioDto.email?.toLowerCase() ?? usuario.email,
      senha: updateUsuarioDto.senha ? this.hashPassword(updateUsuarioDto.senha) : usuario.senha,
    });

    return this.sanitizeUser(usuario);
  }

  async remove(id: number): Promise<{ message: string }> {
    const index = this.data.users.findIndex((item) => item.id_usuario === id);
    if (index < 0) throw new NotFoundException('Usuário não encontrado');
    this.data.users.splice(index, 1);
    return { message: 'Usuário removido com sucesso' };
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, stored: string): boolean {
    const [salt, originalHash] = stored.split(':');
    if (!salt || !originalHash) return false;
    const currentHash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
    return timingSafeEqual(Buffer.from(currentHash), Buffer.from(originalHash));
  }

  private sanitizeUser(usuario: Usuario): Omit<Usuario, 'senha'> {
    const { senha, ...safeUser } = usuario;
    return safeUser;
  }

  private normalizeCpf(cpf?: string): string | undefined {
    if (!cpf) return undefined;
    const digits = String(cpf).replace(/\D/g, '');
    if (!digits) return undefined;
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  private async validateSellerEligibility(
    cpf?: string,
    birthDate?: string | Date,
    currentUserId?: number,
  ): Promise<void> {
    const normalizedCpf = String(cpf || '').replace(/\D/g, '');
    if (!normalizedCpf) throw new BadRequestException('CPF é obrigatório para vendedor');
    if (!this.isValidCpf(normalizedCpf)) throw new BadRequestException('CPF inválido para vendedor');

    const formattedCpf = this.normalizeCpf(normalizedCpf);
    const blockedCpfOwner = this.data.users.find(
      (user) => user.cpf === formattedCpf && user.cpf_bloqueado_venda,
    );
    if (blockedCpfOwner && blockedCpfOwner.id_usuario !== currentUserId) {
      throw new BadRequestException('CPF bloqueado para venda no site');
    }

    if (!birthDate) throw new BadRequestException('Data de nascimento é obrigatória para vendedor');

    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) throw new BadRequestException('Data de nascimento inválida');

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDelta = today.getMonth() - birth.getMonth();
    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) age -= 1;
    if (age < 18) throw new BadRequestException('É necessário ter 18 anos ou mais para vender');
  }

  private isValidCpf(rawCpf: string): boolean {
    const cpf = rawCpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    const calcDigit = (base: string, factor: number) => {
      const sum = base.split('').reduce((acc, char) => acc + Number(char) * factor--, 0);
      const mod = (sum * 10) % 11;
      return mod === 10 ? 0 : mod;
    };

    const first = calcDigit(cpf.slice(0, 9), 10);
    const second = calcDigit(cpf.slice(0, 10), 11);
    return first === Number(cpf[9]) && second === Number(cpf[10]);
  }
}
