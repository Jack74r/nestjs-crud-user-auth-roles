import { Injectable, UsePipes, Body, ValidationPipe, NotFoundException, BadRequestException, Logger, Dependencies } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwtpayload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entities/user.entity';
import { UserLoginDto } from '../user/dto/user-login.dto'
import { UserService } from '../user/user.service';
import * as argon2 from "argon2";
import { validate } from 'class-validator';

@Injectable()
@Dependencies(UserService, JwtService)
export class AuthService {
    constructor(private usersService: UserService, private readonly jwtService: JwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }

    @UsePipes(new ValidationPipe())
    async login(@Body() loginUserDto: UserLoginDto) {
        const _user = await this.usersService.findOne({ email: loginUserDto.email });
        if (!_user)
            throw new NotFoundException("User not found");

        const match = await argon2.verify(_user.password, loginUserDto.password).catch(error => console.log(error));

        if (match == true) {
            const token = await this.generateJWT(_user);
            return { token };
        } else {
            throw new BadRequestException("Wrong Password");
        }

    }

    @UsePipes(new ValidationPipe())
    async register(user: UserEntity) {

        const matchEmail = await this.usersService.findOne({ email: user.email });
        const matchUserName = await this.usersService.findOne({ username: user.username });


        if (matchEmail || matchUserName) {
            throw new BadRequestException({ message: 'Username and email must be unique.' });
        } else {
            const errors = await validate(user);
            if (errors.length > 0) {
                throw new BadRequestException({ message: 'Input data validation failed', errors });

            } else {
                Logger.log("Valide => createOne");

                return await this.usersService.createRegister(user);
            }
        }

    }

    async validateUser(payload: JwtPayload) {
        return await this.usersService.findOne({ id: payload.id });
    }

    decode(token: string): JwtPayload {
        const decode = this.jwtService.decode(token);
        const payload: JwtPayload = JSON.parse(JSON.stringify(decode));
        return payload;
    }

    verify(token: string): boolean {
        try {
            this.jwtService.verify(token);
        } catch (error) {
            return false;
        }
        return true;
    }

    public generateJWT(user: UserEntity): string {
        return this.jwtService.sign(
            { id: user.id }
        );
    };
}
