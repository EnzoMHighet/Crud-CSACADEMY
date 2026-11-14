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
    private alunoModel: Model<Aluno>,
  ) {}

  async create(dto: CreateAlunoDto) {
    const emailExiste = await this.alunoModel.findOne({
      email: dto.email.toLowerCase(),
    });
    if (emailExiste) {
      throw new BadRequestException('Já existe um aluno com este email');
    }

    return this.alunoModel.create(dto);
  }

  async findAll(busca?: string) {
    const alunos = await this.alunoModel.find().sort({ criado_em: 1 });

    if (!busca) {
      return alunos;
    }

    const termo = busca.toLowerCase();
    return alunos.filter(
      (aluno) =>
        aluno.nome.toLowerCase().includes(termo) ||
        aluno.email.toLowerCase().includes(termo),
    );
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
      const outro = await this.alunoModel.findOne({
        email: dto.email.toLowerCase(),
      });
      if (outro && outro._id !== id) {
        throw new BadRequestException('Já existe um aluno com este email');
      }
    }

    aluno.set(dto);
    return aluno.save();
  }

  async replace(id: string, dto: CreateAlunoDto) {
    const aluno = await this.findOne(id);

    const outro = await this.alunoModel.findOne({
      email: dto.email.toLowerCase(),
    });
    if (outro && outro._id !== id) {
      throw new BadRequestException('Já existe um aluno com este email');
    }

    aluno.set(dto);
    return aluno.save();
  }

  async remove(id: string) {
    const aluno = await this.findOne(id);
    await aluno.deleteOne();
    return { mensagem: 'Aluno excluído com sucesso' };
  }
}