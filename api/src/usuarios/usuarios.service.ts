import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Omit<Usuario, 'senha'>[]> {
    const usuarios = await this.usuarioRepository.find({
      order: { id_usuario: 'ASC' },
    });

    return usuarios.map((usuario) => this.sanitizeUser(usuario));
  }

  async findOne(id: number): Promise<Omit<Usuario, 'senha'>> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.sanitizeUser(usuario);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
    const existe = await this.findByEmail(createUsuarioDto.email);

    if (existe) {
      throw new ConflictException('Email já cadastrado');
    }

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      senha: this.hashPassword(createUsuarioDto.senha),
      email: createUsuarioDto.email.toLowerCase(),
      tipo_usuario: createUsuarioDto.tipo_usuario ?? 'cliente',
    });

    const saved = await this.usuarioRepository.save(usuario);
    return this.sanitizeUser(saved);
  }

  async login(email: string, senha: string): Promise<Usuario> {
    const usuario = await this.findByEmail(email);

    if (!usuario || !this.verifyPassword(senha, usuario.senha)) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return usuario;
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Omit<Usuario, 'senha'>> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      const existe = await this.findByEmail(updateUsuarioDto.email);

      if (existe) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    Object.assign(usuario, {
      ...updateUsuarioDto,
      email: updateUsuarioDto.email?.toLowerCase() ?? usuario.email,
      senha: updateUsuarioDto.senha
        ? this.hashPassword(updateUsuarioDto.senha)
        : usuario.senha,
    });

    const saved = await this.usuarioRepository.save(usuario);
    return this.sanitizeUser(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.usuarioRepository.remove(usuario);

    return { message: 'Usuário removido com sucesso' };
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, stored: string): boolean {
    const [salt, originalHash] = stored.split(':');
    if (!salt || !originalHash) {
      return false;
    }

    const currentHash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
    return timingSafeEqual(Buffer.from(currentHash), Buffer.from(originalHash));
  }

  private sanitizeUser(usuario: Usuario): Omit<Usuario, 'senha'> {
    const { senha, ...safeUser } = usuario;
    return safeUser;
  }
}
