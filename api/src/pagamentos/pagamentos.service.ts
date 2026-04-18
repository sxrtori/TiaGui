import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagamento } from './entities/pagamento.entity';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

@Injectable()
export class PagamentosService {
  constructor(
    @InjectRepository(Pagamento)
    private readonly pagamentoRepository: Repository<Pagamento>,
  ) {}

  findAll() {
    return this.pagamentoRepository.find({ order: { id_pagamento: 'DESC' } });
  }

  findByUsuario(idUsuario: number) {
    return this.pagamentoRepository.find({
      where: { id_usuario: idUsuario },
      order: { id_pagamento: 'DESC' },
    });
  }

  async findOne(id: number) {
    const pagamento = await this.pagamentoRepository.findOne({
      where: { id_pagamento: id },
    });
    if (!pagamento) throw new NotFoundException('Pagamento não encontrado');
    return pagamento;
  }

  create(dto: CreatePagamentoDto) {
    const pagamento = this.pagamentoRepository.create(dto);
    return this.pagamentoRepository.save(pagamento);
  }

  async update(id: number, dto: UpdatePagamentoDto) {
    const pagamento = await this.findOne(id);
    Object.assign(pagamento, dto);
    return this.pagamentoRepository.save(pagamento);
  }

  async remove(id: number) {
    const pagamento = await this.findOne(id);
    await this.pagamentoRepository.remove(pagamento);
    return { message: 'Pagamento removido com sucesso' };
  }
}
