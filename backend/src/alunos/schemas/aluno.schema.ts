import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';

@Schema({
  timestamps: { createdAt: 'criado_em', updatedAt: false },
  versionKey: false,
  toJSON: {
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class Aluno {
  @Prop({ type: String, default: () => randomUUID() })
  _id: string;

  @Prop({ required: true, trim: true })
  nome: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop()
  telefone?: string;

  @Prop({ required: true, trim: true })
  curso: string;

  @Prop({ default: true })
  ativo: boolean;

  criado_em: Date;
}

export const AlunoSchema = SchemaFactory.createForClass(Aluno);