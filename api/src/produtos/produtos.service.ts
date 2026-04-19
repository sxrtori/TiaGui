import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoCor } from './entities/produto-cor.entity';
import { ProdutoImagem } from './entities/produto-imagem.entity';
import { ProdutoTamanho } from './entities/produto-tamanho.entity';
import { ProdutoVariacao } from './entities/produto-variacao.entity';
import { Produto } from './entities/produto.entity';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    @InjectRepository(ProdutoImagem)
    private readonly imagemRepository: Repository<ProdutoImagem>,
    @InjectRepository(ProdutoVariacao)
    private readonly variacaoRepository: Repository<ProdutoVariacao>,
    @InjectRepository(ProdutoCor)
    private readonly corRepository: Repository<ProdutoCor>,
    @InjectRepository(ProdutoTamanho)
    private readonly tamanhoRepository: Repository<ProdutoTamanho>,
  ) {}

  async findAll(filters?: {
    q?: string;
    id_categoria?: number;
    promocao?: string;
    vendedorId?: number;
  }): Promise<Record<string, unknown>[]> {
    const qb = this.produtoRepository
      .createQueryBuilder('produto')
      .leftJoinAndSelect('produto.categoria', 'categoria')
      .leftJoinAndSelect('produto.imagens', 'imagens')
      .leftJoinAndSelect('produto.cores', 'cores')
      .leftJoinAndSelect('produto.tamanhos', 'tamanhos')
      .leftJoinAndSelect('produto.variacoes', 'variacoes')
      .leftJoinAndSelect('variacoes.cor', 'variacaoCor')
      .leftJoinAndSelect('variacoes.tamanho', 'variacaoTamanho');

    if (filters?.id_categoria)
      qb.andWhere('produto.id_categoria = :idCategoria', {
        idCategoria: filters.id_categoria,
      });
    if (filters?.q?.trim()) {
      const term = `%${filters.q.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(produto.nome) LIKE :term OR LOWER(produto.descricao) LIKE :term OR LOWER(produto.marca) LIKE :term OR LOWER(categoria.nome) LIKE :term)',
        { term },
      );
    }

    qb.orderBy('produto.created_at', 'DESC');

    const produtos = await qb.getMany();
    return produtos
      .filter((produto) =>
        filters?.promocao === 'true' ? Boolean(produto.destaque) : true,
      )
      .map((produto) => this.toFrontProduct(produto));
  }

  async findOne(id: number): Promise<Record<string, unknown>> {
    const produto = await this.produtoRepository.findOne({
      where: { id_produto: id },
      relations: {
        categoria: true,
        imagens: true,
        variacoes: { cor: true, tamanho: true },
        cores: true,
        tamanhos: true,
      },
    });

    if (!produto) throw new NotFoundException('Produto não encontrado');
    return this.toFrontProduct(produto);
  }

  async findBySlug(slug: string): Promise<Record<string, unknown>> {
    const produto = await this.produtoRepository.findOne({
      where: { slug },
      relations: {
        categoria: true,
        imagens: true,
        variacoes: { cor: true, tamanho: true },
        cores: true,
        tamanhos: true,
      },
    });

    if (!produto) throw new NotFoundException('Produto não encontrado');
    return this.toFrontProduct(produto);
  }

  async create(
    createProdutoDto: CreateProdutoDto,
  ): Promise<Record<string, unknown>> {

    // ✅ MAPA
    const mapaCategorias = {
      masculino: 1,
      feminino: 2,
      calcados: 3,
      acessorios: 4,
      esportes: 5,
    };

    let id_categoria = createProdutoDto.id_categoria;

    if (!id_categoria && (createProdutoDto as any).categoria) {
      const categoriaNormalizada = (createProdutoDto as any).categoria
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      id_categoria = mapaCategorias[categoriaNormalizada];
    }

    if (!id_categoria) {
      throw new Error('Categoria inválida ou não enviada');
    }

    const produto = await this.produtoRepository.save(
      this.produtoRepository.create({
        id_categoria: id_categoria,
        nome: createProdutoDto.nome,
        descricao: createProdutoDto.descricao,
        preco: createProdutoDto.preco,
        genero: createProdutoDto.genero,
        marca: createProdutoDto.marca,
        slug: createProdutoDto.slug || this.slugify(createProdutoDto.nome),
        ativo: createProdutoDto.ativo ?? true,
        destaque: createProdutoDto.destaque ?? false,
        desconto: Number((createProdutoDto as any).desconto ?? 0),
        promocao_ativa: Boolean((createProdutoDto as any).promocao_ativa ?? false),
      }),
    );

    try {
      await this.syncProdutoRelations(produto.id_produto, createProdutoDto);
    } catch (error) {
      console.error('ERRO NAS RELAÇÕES:', error);
    }
    return this.findOne(produto.id_produto);
  }

  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Record<string, unknown>> {
    const produto = await this.produtoRepository.findOne({
      where: { id_produto: id },
    });
    if (!produto) throw new NotFoundException('Produto não encontrado');

    Object.assign(produto, {
      ...updateProdutoDto,
      slug:
        updateProdutoDto.slug ||
        (updateProdutoDto.nome
          ? this.slugify(updateProdutoDto.nome)
          : produto.slug),
    });

    await this.produtoRepository.save(produto);
    await this.syncProdutoRelations(id, updateProdutoDto);

    return this.findOne(id);
  }

  async updatePromotion(
    id: number,
    promocao_ativa: boolean,
    desconto?: number,
  ) {
    return this.update(id, {
      destaque: promocao_ativa,
      promocao_ativa,
      desconto: Number(desconto ?? 0),
    } as any);
  }

  async updateStock(id: number, estoque: number) {
    const variacao = await this.variacaoRepository.findOne({
      where: { id_produto: id },
      order: { id_produto_variacao: 'ASC' },
    });

    if (!variacao) {
      throw new NotFoundException(
        'Variação não encontrada para atualizar estoque',
      );
    }

    variacao.estoque = estoque;
    await this.variacaoRepository.save(variacao);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const produto = await this.produtoRepository.findOne({
      where: { id_produto: id },
    });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    await this.produtoRepository.remove(produto);
    return { message: 'Produto removido com sucesso' };
  }

  private async syncProdutoRelations(
    idProduto: number,
    dto: Partial<CreateProdutoDto>,
  ): Promise<void> {
    if (dto.cores?.length) {
      await this.corRepository.delete({ id_produto: idProduto });
      await this.corRepository.save(
        dto.cores.map((nomeCor, ordem) =>
          this.corRepository.create({
            id_produto: idProduto,
            nome_cor: nomeCor,
            ordem,
            ativa: true,
          }),
        ),
      );
    }

    if (dto.tamanhos?.length) {
      await this.tamanhoRepository.delete({ id_produto: idProduto });
      await this.tamanhoRepository.save(
        dto.tamanhos.map((tamanho, ordem) =>
          this.tamanhoRepository.create({
            id_produto: idProduto,
            tamanho,
            ordem,
            ativo: true,
          }),
        ),
      );
    }

    if (dto.imagens?.length || dto.imagem) {
      await this.imagemRepository.delete({ id_produto: idProduto });
      const imagens = dto.imagens?.length
        ? dto.imagens
        : [{ url_imagem: String(dto.imagem), principal: true, ordem: 0 }];
      await this.imagemRepository.save(
        imagens.map((imagem, idx) =>
          this.imagemRepository.create({
            id_produto: idProduto,
            id_produto_cor: imagem.id_produto_cor,
            url_imagem: imagem.url_imagem,
            alt_text: imagem.alt_text,
            principal: imagem.principal ?? idx === 0,
            ordem: imagem.ordem ?? idx,
          }),
        ),
      );
    }

    if (dto.variacoes?.length) {
      await this.variacaoRepository.delete({ id_produto: idProduto });
      await this.variacaoRepository.save(
        dto.variacoes.map((variacao) =>
          this.variacaoRepository.create({
            id_produto: idProduto,
            id_produto_cor: variacao.id_produto_cor,
            id_produto_tamanho: variacao.id_produto_tamanho,
            sku: variacao.sku,
            preco: variacao.preco,
            estoque: variacao.estoque,
            numeracao: variacao.numeracao,
            ativa: true,
          }),
        ),
      );
      return;
    }

    if (typeof dto.estoque === 'number') {
      const primeira = await this.variacaoRepository.findOne({
        where: { id_produto: idProduto },
      });
      if (primeira) {
        primeira.estoque = dto.estoque;
        await this.variacaoRepository.save(primeira);
      } else {
        await this.variacaoRepository.save(
          this.variacaoRepository.create({
            id_produto: idProduto,
            estoque: dto.estoque,
            numeracao: dto.numeracao,
            ativa: true,
          }),
        );
      }
    }
  }

  private toFrontProduct(produto: Produto): Record<string, unknown> {
    const imagens = [...(produto.imagens || [])].sort(
      (a, b) => a.ordem - b.ordem,
    );
    const variacoes = [...(produto.variacoes || [])].sort(
      (a, b) => a.id_produto_variacao - b.id_produto_variacao,
    );
    const estoqueTotal = variacoes.reduce(
      (total, variacao) => total + Number(variacao.estoque || 0),
      0,
    );

    const primeiroPrecoVariacao = variacoes.find(
      (variacao) => variacao.preco != null,
    )?.preco;
    const preco = Number(produto.preco);

    return {
      ...produto,
      id: produto.id_produto,
      categoria: produto.categoria?.nome,
      preco,
      preco_promocional: primeiroPrecoVariacao
        ? Number(primeiroPrecoVariacao)
        : undefined,
      imagem:
        imagens.find((imagem) => imagem.principal)?.url_imagem ||
        imagens[0]?.url_imagem ||
        '',
      imagens,
      estoque: estoqueTotal,
      promocao_ativa: Boolean(produto.promocao_ativa ?? produto.destaque),
      desconto: Number(produto.desconto || 0),
      
      cores: (produto.cores || []).map((cor) => ({
        id_produto_cor: cor.id_produto_cor,
        nome_cor: cor.nome_cor,
        codigo_hex: cor.codigo_hex,
      })),
      tamanhos: (produto.tamanhos || []).map((tamanho) => ({
        id_produto_tamanho: tamanho.id_produto_tamanho,
        tamanho: tamanho.tamanho,
      })),
      variacoes: variacoes.map((variacao) => ({
        id_produto_variacao: variacao.id_produto_variacao,
        id_produto_cor: variacao.id_produto_cor,
        id_produto_tamanho: variacao.id_produto_tamanho,
        cor: variacao.cor?.nome_cor,
        tamanho: variacao.tamanho?.tamanho,
        preco: variacao.preco ? Number(variacao.preco) : null,
        estoque: variacao.estoque,
        numeracao: variacao.numeracao,
      })),
      numeracao: variacoes
        .map((variacao) => variacao.numeracao)
        .filter(Boolean)
        .join(','),
    };
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
}
