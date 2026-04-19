import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { Produto } from './entities/produto.entity';
import { ProdutoImagem } from './entities/produto-imagem.entity';

const DEFAULT_PRODUCTS = [
  {
    nome: 'Tênis Sprint Velocity',
    descricao: 'Tênis leve para corrida com amortecimento responsivo.',
    preco: 349.9,
    genero: 'Unissex',
    marca: 'SportX',
    categoriaNome: 'Calçados',
    imagem:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nome: 'Camisa Dry Performance',
    descricao: 'Camisa esportiva respirável para treinos intensos.',
    preco: 119.9,
    genero: 'Masculino',
    marca: 'SportX',
    categoriaNome: 'Masculino',
    imagem:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nome: 'Top Active Balance',
    descricao: 'Top com alta sustentação e secagem rápida.',
    preco: 99.9,
    genero: 'Feminino',
    marca: 'SportX',
    categoriaNome: 'Feminino',
    imagem:
      'https://images.unsplash.com/photo-1506629905607-d405b7a5a2a8?auto=format&fit=crop&w=1200&q=80',
  },
];

@Injectable()
export class ProdutosSeedService {
  private readonly logger = new Logger(ProdutosSeedService.name);

  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(ProdutoImagem)
    private readonly produtoImagemRepository: Repository<ProdutoImagem>,
  ) {}

  async seedDefaultProducts() {
    const categorias = await this.categoriaRepository.find();
    if (!categorias.length) {
      this.logger.warn('Seed de produtos ignorado: nenhuma categoria cadastrada.');
      return { inserted: 0, skipped: DEFAULT_PRODUCTS.length };
    }

    let inserted = 0;
    let skipped = 0;

    for (const item of DEFAULT_PRODUCTS) {
      const slug = this.slugify(item.nome);
      let produto = await this.produtoRepository.findOne({
        where: [{ nome: item.nome }, { slug }],
      });

      const categoria =
        categorias.find(
          (cat) => cat.nome?.toLowerCase() === item.categoriaNome.toLowerCase(),
        ) || categorias[0];

      if (!produto) {
        produto = await this.produtoRepository.save(
          this.produtoRepository.create({
            id_categoria: categoria.id_categoria,
            nome: item.nome,
            descricao: item.descricao,
            preco: item.preco,
            genero: item.genero,
            marca: item.marca,
            ativo: true,
            destaque: false,
            slug,
          }),
        );

        inserted += 1;
      } else {
        skipped += 1;
      }

      const imagemExistente = await this.produtoImagemRepository.findOne({
        where: {
          id_produto: produto.id_produto,
          url_imagem: item.imagem,
        },
      });

      if (!imagemExistente) {
        await this.produtoImagemRepository.save(
          this.produtoImagemRepository.create({
            id_produto: produto.id_produto,
            url_imagem: item.imagem,
            alt_text: item.nome,
            principal: true,
            ordem: 0,
          }),
        );
      }
    }

    this.logger.log(
      `Seed de produtos finalizado: ${inserted} inseridos, ${skipped} já existentes.`,
    );

    return { inserted, skipped };
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
