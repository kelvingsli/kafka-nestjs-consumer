import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WikiPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key_id: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  title_url: string;

  @Column({ nullable: true })
  source: string;
}
