
import { UserEntity } from '../entities/user.entity';
import { Controller, Logger, UseGuards } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest } from '@nestjsx/crud';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Crud({

    model: {
        type: UserEntity,
    },
    query: {
        exclude: ['email', 'password', 'phone'],
    },
    routes: {
        deleteOneBase: {
            decorators: [UseGuards(JwtAuthGuard), Roles('admin')],
        },

    }
})

@Controller('users')
export class UserController implements CrudController<UserEntity> {

    constructor(public service: UserService) { }

    get base(): CrudController<UserEntity> {
        return this;
    }

    /*  Example overide
     @Override()
      @UseGuards(JwtAuthGuard)
      @Roles('admin')
      async deleteOne(
          @ParsedRequest() req: CrudRequest,
      ) {
          return this.base.deleteOneBase(req);
      } */

}