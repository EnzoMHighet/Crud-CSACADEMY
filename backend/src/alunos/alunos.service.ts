import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAlunoDto } from './dto/create-aluno.dto.js';
import { UpdateAlunoDto } from './dto/update-aluno.dto.js';
import { Aluno } from './schemas/aluno.schema.js';

@Injectable()
export class AlunosService {
  constructor(
    @InjectModel(Aluno.name)
    private readonly alunoModel: Model<Aluno>,
  ) {}

  private async validarEmailUnico(email: string, idIgnorado?: string) {
    const existente = await this.alunoModel.findOne({
      email: email.trim().toLowerCase(),
    });
    if (existente && existente._id !== idIgnorado) {
      throw new BadRequestException('Já existe um aluno com este email');
    }
  }

  async create(dto: CreateAlunoDto) {
    await this.validarEmailUnico(dto.email);
    return this.alunoModel.create(dto);
  }

  findAll(busca?: string) {
    const termo = busca?.trim();
    let filtro = {};
    if (termo) {
      const escapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapado, 'i');
      filtro = { $or: [{ nome: regex }, { email: regex }] };
    }
    return this.alunoModel.find(filtro).sort({ criado_em: 1 });
  }

  async findOne(id: string) {
    const aluno = await this.alunoModel.findById(id);
    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }
    return aluno;
  }

  async update(id: string, dto: UpdateAlunoDto) {
    const aluno = await this.findOne(id);
    if (dto.email) {
      await this.validarEmailUnico(dto.email, id);
    }
    aluno.set(dto);
    return aluno.save();
  }

  async replace(id: string, dto: CreateAlunoDto) {
    const aluno = await this.findOne(id);
    await this.validarEmailUnico(dto.email, id);
    aluno.set(dto);
    return aluno.save();
  }

  async remove(id: string) {
    const aluno = await this.findOne(id);
    await aluno.deleteOne();
    return { mensagem: 'Aluno excluído com sucesso' };
  }
}