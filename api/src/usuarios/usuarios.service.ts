import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      order: { id_usuario: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const existe = await this.findByEmail(createUsuarioDto.email);

    if (existe) {
      throw new ConflictException('Email já cadastrado');
    }

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      email: createUsuarioDto.email.toLowerCase(),
      tipo_usuario: createUsuarioDto.tipo_usuario ?? 'cliente',
    });

    return this.usuarioRepository.save(usuario);
  }

  async login(email: string, senha: string): Promise<Usuario> {
    const usuario = await this.findByEmail(email);

    if (!usuario || usuario.senha !== senha) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      const existe = await this.findByEmail(updateUsuarioDto.email);

      if (existe) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    Object.assign(usuario, updateUsuarioDto);

    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<{ message: string }> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);

    return { message: 'Usuário removido com sucesso' };
  }
}
