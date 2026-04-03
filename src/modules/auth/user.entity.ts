import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique
} from 'typeorm';
import { RoleType } from '../../types/role.type';

@Entity('users')
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'user'})
  role!: RoleType;
}
