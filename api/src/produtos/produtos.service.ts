import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
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
      return this.produtoRepository.find({
        where: [
          { ...where, nome: ILike(term) },
          { ...where, descricao: ILike(term) },
          { ...where, marca: ILike(term) },
          { ...where, modalidade: ILike(term) },
        ],
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

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const produto = this.produtoRepository.create(createProdutoDto);
    return this.produtoRepository.save(produto);
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id);
    Object.assign(produto, updateProdutoDto);
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
}
