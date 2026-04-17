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
import { AvaliacaoVendedor } from './entities/avaliacao-vendedor.entity';
import { CreateAvaliacaoVendedorDto } from './dto/create-avaliacao-vendedor.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Produto } from '../produtos/entities/produto.entity';

@Injectable()
export class AvaliacoesService {
  constructor(
    @InjectRepository(Avaliacao)
    private readonly avaliacaoRepository: Repository<Avaliacao>,
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(AvaliacaoVendedor)
    private readonly avaliacaoVendedorRepository: Repository<AvaliacaoVendedor>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
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
    const saved = await this.avaliacaoRepository.save(record);
    await this.syncProductRating(dto.id_produto);
    return saved;
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
    const productId = review.id_produto;
    await this.avaliacaoRepository.remove(review);
    await this.syncProductRating(productId);
    return { message: 'Avaliação removida com sucesso' };
  }

  async report(id: number) {
    const review = await this.avaliacaoRepository.findOne({ where: { id_avaliacao: id } });
    if (!review) throw new NotFoundException('Avaliação não encontrada');
    review.denunciada = true;
    return this.avaliacaoRepository.save(review);
  }

  async createSellerReview(dto: CreateAvaliacaoVendedorDto) {
    if (!dto.comentario?.trim()) {
      throw new BadRequestException('Comentário não pode ser vazio');
    }
    if (dto.id_usuario === dto.id_vendedor) {
      throw new BadRequestException('Não é possível avaliar a própria conta de vendedor');
    }

    const seller = await this.usuarioRepository.findOne({
      where: { id_usuario: dto.id_vendedor },
    });
    if (!seller || seller.tipo_usuario !== 'vendedor') {
      throw new NotFoundException('Vendedor não encontrado');
    }

    const duplicate = await this.avaliacaoVendedorRepository.findOne({
      where: { id_usuario: dto.id_usuario, id_vendedor: dto.id_vendedor },
    });
    if (duplicate) {
      throw new BadRequestException('Você já avaliou este vendedor');
    }

    const record = this.avaliacaoVendedorRepository.create(dto);
    const saved = await this.avaliacaoVendedorRepository.save(record);
    await this.syncSellerRating(dto.id_vendedor);
    return saved;
  }

  async listBySeller(id_vendedor: number) {
    const reviews = await this.avaliacaoVendedorRepository.find({
      where: { id_vendedor },
      order: { data_criacao: 'DESC' },
    });
    const total = reviews.length;
    const media = total
      ? Number((reviews.reduce((sum, r) => sum + Number(r.nota || 0), 0) / total).toFixed(2))
      : 0;
    return { media, total, reviews };
  }

  private async syncProductRating(id_produto: number) {
    const reviews = await this.avaliacaoRepository.find({ where: { id_produto } });
    const total = reviews.length;
    const media = total
      ? Number((reviews.reduce((sum, r) => sum + Number(r.nota || 0), 0) / total).toFixed(2))
      : 0;
    await this.produtoRepository.update(id_produto, {
      media_avaliacao: media,
      total_avaliacoes: total,
    });
  }

  private async syncSellerRating(id_vendedor: number) {
    const reviews = await this.avaliacaoVendedorRepository.find({ where: { id_vendedor } });
    const total = reviews.length;
    const media = total
      ? Number((reviews.reduce((sum, r) => sum + Number(r.nota || 0), 0) / total).toFixed(2))
      : 0;
    const blocked = total >= 15 && media < 3.5;
    await this.usuarioRepository.update(id_vendedor, {
      media_avaliacao_vendedor: media,
      total_avaliacoes_vendedor: total,
      vendedor_bloqueado: blocked,
      cpf_bloqueado_venda: blocked,
      motivo_bloqueio: blocked
        ? 'Conta bloqueada para vender: 15+ avaliações com média inferior a 3.5'
        : undefined,
    });
  }
}
