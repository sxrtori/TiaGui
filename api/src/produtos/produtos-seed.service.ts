import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { Produto } from './entities/produto.entity';

const DEFAULT_PRODUCTS = [
  {
    nome: 'Tênis Sprint Velocity',
    descricao: 'Tênis leve para corrida com amortecimento responsivo.',
    preco: 349.9,
    genero: 'Unissex',
    marca: 'SportX',
    categoriaNome: 'Calçados',
  },
  {
    nome: 'Camisa Dry Performance',
    descricao: 'Camisa esportiva respirável para treinos intensos.',
    preco: 119.9,
    genero: 'Masculino',
    marca: 'SportX',
    categoriaNome: 'Masculino',
  },
  {
    nome: 'Top Active Balance',
    descricao: 'Top com alta sustentação e secagem rápida.',
    preco: 99.9,
    genero: 'Feminino',
    marca: 'SportX',
    categoriaNome: 'Feminino',
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
      const existente = await this.produtoRepository.findOne({
        where: { nome: item.nome },
      });

      if (existente) {
        skipped += 1;
        continue;
      }

      const categoria =
        categorias.find((cat) =>
          cat.nome?.toLowerCase() === item.categoriaNome.toLowerCase(),
        ) || categorias[0];

      await this.produtoRepository.save(
        this.produtoRepository.create({
          id_categoria: categoria.id_categoria,
          nome: item.nome,
          descricao: item.descricao,
          preco: item.preco,
          genero: item.genero,
          marca: item.marca,
          ativo: true,
          destaque: false,
          slug: this.slugify(item.nome),
        }),
      );

      inserted += 1;
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
