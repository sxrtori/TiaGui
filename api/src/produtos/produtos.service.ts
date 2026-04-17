import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

const CATEGORIA_ALIAS: Record<string, number> = {
  masculino: 1,
  feminino: 2,
  calçados: 3,
  calcados: 3,
  acessórios: 4,
  acessorios: 4,
  esportes: 5,
};

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(filters?: {
    q?: string;
    id_categoria?: number;
    promocao?: string;
    vendedorId?: number;
  }): Promise<Produto[]> {
    const where: any = {};

    if (filters?.id_categoria) where.id_categoria = filters.id_categoria;
    if (filters?.promocao === 'true') where.promocao_ativa = true;
    if (filters?.vendedorId) where.id_vendedor = filters.vendedorId;

    if (filters?.q?.trim()) {
      const term = `%${filters.q.trim()}%`;
      const categoriaByText = CATEGORIA_ALIAS[filters.q.trim().toLowerCase()];
      const whereList = [
        { ...where, nome: ILike(term) },
        { ...where, descricao: ILike(term) },
        { ...where, marca: ILike(term) },
        { ...where, modalidade: ILike(term) },
      ];

      if (categoriaByText) {
        whereList.push({ ...where, id_categoria: In([categoriaByText]) });
      }

      return this.produtoRepository.find({
        where: whereList,
        order: { created_at: 'DESC' },
      });
    }

    return this.produtoRepository.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id_produto: id },
    });

    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async findBySlug(slug: string): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { slug },
    });

    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    if (createProdutoDto.id_vendedor) {
      await this.assertSellerCanSell(createProdutoDto.id_vendedor);
    }
    const produto = this.produtoRepository.create({
      ...createProdutoDto,
      slug: createProdutoDto.slug || this.slugify(createProdutoDto.nome),
    });
    return this.produtoRepository.save(produto);
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id);
    const sellerId = updateProdutoDto.id_vendedor || produto.id_vendedor;
    if (sellerId) {
      await this.assertSellerCanSell(sellerId);
    }
    Object.assign(produto, {
      ...updateProdutoDto,
      slug:
        updateProdutoDto.slug ||
        (updateProdutoDto.nome ? this.slugify(updateProdutoDto.nome) : produto.slug),
    });
    return this.produtoRepository.save(produto);
  }

  async updatePromotion(id: number, promocao_ativa: boolean, desconto?: number) {
    const payload: UpdateProdutoDto = { promocao_ativa };
    if (typeof desconto === 'number') payload.desconto = desconto;
    return this.update(id, payload);
  }

  async updateStock(id: number, estoque: number) {
    return this.update(id, { estoque });
  }

  async remove(id: number): Promise<{ message: string }> {
    const produto = await this.findOne(id);
    await this.produtoRepository.remove(produto);
    return { message: 'Produto removido com sucesso' };
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 180);
  }

  private async assertSellerCanSell(id_vendedor: number): Promise<void> {
    const seller = await this.usuarioRepository.findOne({
      where: { id_usuario: id_vendedor },
    });
    if (!seller || seller.tipo_usuario !== 'vendedor') {
      throw new ForbiddenException('Somente contas de vendedor podem anunciar');
    }
    if (seller.vendedor_bloqueado) {
      throw new ForbiddenException(
        seller.motivo_bloqueio || 'Vendedor bloqueado por média de avaliação inferior a 4.0',
      );
    }
  }
}
