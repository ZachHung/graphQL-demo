import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  public readonly id!: string;

  @Column()
  @Field()
  public title!: string;

  @Column()
  @Field()
  public content!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.id)
  public user!: User;

  @Column({ type: 'uuid' })
  public userId!: string;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
