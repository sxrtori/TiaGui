import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { InMemoryDataService } from '../storage/in-memory-data.service';

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
  constructor(private readonly data: InMemoryDataService) {}

  async findAll(filters?: {
    q?: string;
    id_categoria?: number;
    promocao?: string;
    vendedorId?: number;
  }): Promise<Produto[]> {
    let products = [...this.data.products];

    if (filters?.id_categoria) products = products.filter((item) => item.id_categoria === filters.id_categoria);
    if (filters?.promocao === 'true') products = products.filter((item) => Boolean(item.promocao_ativa));
    if (filters?.vendedorId) products = products.filter((item) => item.id_vendedor === filters.vendedorId);

    if (filters?.q?.trim()) {
      const term = filters.q.trim().toLowerCase();
      const categoriaByText = CATEGORIA_ALIAS[term];
      products = products.filter((item) => {
        const searchable = [item.nome, item.descricao, item.marca, item.modalidade]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return searchable.includes(term) || (categoriaByText ? item.id_categoria === categoriaByText : false);
      });
    }

    return products.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  }

  async findOne(id: number): Promise<Produto> {
    const produto = this.data.products.find((item) => item.id_produto === id);
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async findBySlug(slug: string): Promise<Produto> {
    const produto = this.data.products.find((item) => item.slug === slug);
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    if (createProdutoDto.id_vendedor) await this.assertSellerCanSell(createProdutoDto.id_vendedor);

    const produto: Produto = {
      ...createProdutoDto,
      id_produto: this.data.nextId('product'),
      slug: createProdutoDto.slug || this.slugify(createProdutoDto.nome),
      desconto: Number(createProdutoDto.desconto || 0),
      cashback: Number(createProdutoDto.cashback || 0),
      ativo: createProdutoDto.ativo ?? true,
      lancamento: Boolean(createProdutoDto.lancamento),
      promocao_ativa: Boolean(createProdutoDto.promocao_ativa),
      origem_cep: createProdutoDto.origem_cep || '01001-000',
      media_avaliacao: 0,
      total_avaliacoes: 0,
      peso_kg: Number(createProdutoDto.peso_kg || 0.3),
      altura_cm: Number(createProdutoDto.altura_cm || 5),
      largura_cm: Number(createProdutoDto.largura_cm || 20),
      comprimento_cm: Number(createProdutoDto.comprimento_cm || 30),
      created_at: new Date(),
    } as Produto;

    this.data.products.unshift(produto);
    return produto;
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id);
    const sellerId = updateProdutoDto.id_vendedor || produto.id_vendedor;
    if (sellerId) await this.assertSellerCanSell(sellerId);

    Object.assign(produto, {
      ...updateProdutoDto,
      slug: updateProdutoDto.slug || (updateProdutoDto.nome ? this.slugify(updateProdutoDto.nome) : produto.slug),
    });

    return produto;
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
    const index = this.data.products.findIndex((item) => item.id_produto === id);
    if (index < 0) throw new NotFoundException('Produto não encontrado');
    this.data.products.splice(index, 1);
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
    const seller = this.data.users.find((user) => user.id_usuario === id_vendedor);
    if (!seller || seller.tipo_usuario !== 'vendedor') {
      throw new ForbiddenException('Somente contas de vendedor podem anunciar');
    }
    if (seller.vendedor_bloqueado) {
      throw new ForbiddenException(
        seller.motivo_bloqueio || 'Vendedor bloqueado: 15+ avaliações com média inferior a 3.5',
      );
    }
  }
}
