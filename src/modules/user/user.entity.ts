import { Authorized, Field, ObjectType } from 'type-graphql/dist/decorators';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../core/types/role.enum';
import { Post } from '../post/post.entity';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string;

  @Field()
  @Column()
  public firstName!: string;

  @Field()
  @Column()
  public lastName!: string;

  @Field()
  @Column()
  public age!: number;

  @Authorized(Role.ADMIN)
  @Field({ nullable: true })
  @Column()
  public password!: string;

  @Field()
  @Column({ unique: true })
  public email!: string;

  @Field()
  @Column({ unique: true })
  public username!: string;

  @Column({ nullable: true })
  public refreshToken?: string;

  @Authorized(Role.ADMIN)
  @Field(() => Role, { nullable: true })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  public role!: Role;

  @Field(() => [Post], { nullable: 'items' })
  @OneToMany(() => Post, (post: Post) => post.user)
  public posts?: Promise<Post[]>;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
