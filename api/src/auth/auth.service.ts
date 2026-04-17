import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { generateAccessToken } from './token.util';

@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.login(loginDto.email, loginDto.senha);

    const access_token = generateAccessToken({
      sub: usuario.id_usuario,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
    });

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: 60 * 60 * 8,
      user: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
        data_criacao: usuario.data_criacao,
      },
    };
  }
}
