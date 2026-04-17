import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.login(loginDto.email, loginDto.senha);

    return {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      data_criacao: usuario.data_criacao,
    };
  }
}
