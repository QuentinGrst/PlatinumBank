import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dab {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}