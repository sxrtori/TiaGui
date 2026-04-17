import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avaliacao } from './entities/avaliacao.entity';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { Pedido } from '../pedidos/entities/pedido.entity';

@Injectable()
export class AvaliacoesService {
  constructor(
    @InjectRepository(Avaliacao)
    private readonly avaliacaoRepository: Repository<Avaliacao>,
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
  ) {}

  async create(dto: CreateAvaliacaoDto) {
    if (!dto.comentario?.trim()) {
      throw new BadRequestException('Comentário não pode ser vazio');
    }

    const duplicateWhere: any = {
      id_usuario: dto.id_usuario,
      id_produto: dto.id_produto,
    };
    if (dto.id_pedido) duplicateWhere.id_pedido = dto.id_pedido;

    const duplicate = await this.avaliacaoRepository.findOne({
      where: duplicateWhere,
    });
    if (duplicate) {
      throw new BadRequestException('Já existe avaliação para este pedido/produto');
    }

    if (dto.id_pedido) {
      const order = await this.pedidoRepository.findOne({
        where: { id_pedido: dto.id_pedido, id_usuario: dto.id_usuario },
      });
      if (!order) throw new ForbiddenException('Somente compradores do pedido podem avaliar');
    }

    const record = this.avaliacaoRepository.create(dto);
    return this.avaliacaoRepository.save(record);
  }

  async listByProduct(id_produto: number) {
    const reviews = await this.avaliacaoRepository.find({
      where: { id_produto },
      order: { data_criacao: 'DESC' },
    });
    const total = reviews.length;
    const media = total
      ? Number((reviews.reduce((sum, r) => sum + Number(r.nota || 0), 0) / total).toFixed(2))
      : 0;

    return { media, total, reviews };
  }

  async update(id: number, id_usuario: number, dto: UpdateAvaliacaoDto) {
    const review = await this.avaliacaoRepository.findOne({ where: { id_avaliacao: id } });
    if (!review) throw new NotFoundException('Avaliação não encontrada');
    if (review.id_usuario !== id_usuario) throw new ForbiddenException('Sem permissão para editar');

    if (dto.comentario !== undefined && !dto.comentario.trim()) {
      throw new BadRequestException('Comentário não pode ser vazio');
    }

    Object.assign(review, dto);
    return this.avaliacaoRepository.save(review);
  }

  async remove(id: number, id_usuario: number) {
    const review = await this.avaliacaoRepository.findOne({ where: { id_avaliacao: id } });
    if (!review) throw new NotFoundException('Avaliação não encontrada');
    if (review.id_usuario !== id_usuario) throw new ForbiddenException('Sem permissão para excluir');
    await this.avaliacaoRepository.remove(review);
    return { message: 'Avaliação removida com sucesso' };
  }

  async report(id: number) {
    const review = await this.avaliacaoRepository.findOne({ where: { id_avaliacao: id } });
    if (!review) throw new NotFoundException('Avaliação não encontrada');
    review.denunciada = true;
    return this.avaliacaoRepository.save(review);
  }
}
