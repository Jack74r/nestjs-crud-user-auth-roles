import { UserEntity } from './../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {

    constructor(@InjectRepository(UserEntity) repo,
    ) {
        super(repo);
    }

    async createRegister(user: UserEntity) {
        return await this.repo.save(user);
    }

}