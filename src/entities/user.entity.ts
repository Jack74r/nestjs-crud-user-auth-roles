import { Entity, Column, BeforeInsert } from 'typeorm';
import { IsEmail, IsDate, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { BaseEntity } from './base-entity';
import * as argon2 from "argon2";


@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Column()
  username: string;

  @IsNotEmpty()
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
  @IsNotEmpty()
  @Column({ default: "user" })
  role: string;

  @Column({ default: null })
  firstname: string;

  @Column({ default: null })
  lastname: string;

  @IsDate()
  @Column({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
  birthday: Date;

  @Column({ default: null })
  urlPhoto: string;

  @IsNumber()
  @Column({ default: null })
  phone: string;
  @IsNumber()
  @Column({ default: null })
  departement: string;

  @IsBoolean()
  @Column({ default: true })
  isActive: boolean;

  @Column({ default: null })
  description: string
}