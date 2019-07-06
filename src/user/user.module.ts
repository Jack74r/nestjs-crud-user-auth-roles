import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserEntity } from './../entities/user.entity';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => AuthModule)
        ,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secretOrPrivateKey: 'secretKey',
        signOptions: {
            expiresIn: 3600,
        },
    })],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule { }
