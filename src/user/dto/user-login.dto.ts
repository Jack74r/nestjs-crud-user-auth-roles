
import { IsNotEmpty, IsEmail } from "class-validator";

export class UserLoginDto {

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}

