import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RabbitmqService } from '../lib/rabbitmq/rabbitmq.service';
@Controller('api')
export class UserController {
  constructor(
    private userService: UserService,
    private rabbitmqService: RabbitmqService,
  ) {}
  @Post('users')
  async createUser(@Body() user: CreateUserDto, @Res() res): Promise<boolean> {
  //   await this.rabbitmqService.connect();
  //  await this.rabbitmqService.sendMessage('userQueue', 'RabbitMQ Event!');
  //  await this.rabbitmqService.closeConnection();
    try {
      const users = await this.userService.create(user);
       Object.keys(user).length > 0
        ? res.json({ success: true, message: 'user created', users })
        : res.json({ success: true, message: 'users fetched from API', users });
      } catch (err) {
        res.json({ success: false, message: 'have a mistake', err });
      }
      return true
    }

  @Get('user/:id')
  async getUsers(@Param('id') id: string, @Res() res): Promise<boolean> {
    try {
      const userData = await this.userService.retriveData(id);
      if (userData) {
        res.json({ success: true, message: 'data fetched', data: userData });
        return true;
      } else {
        res.json({ success: false, message: 'user not found' });
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        res.json({ success: false, message: 'user not found' });
      } else {
        res.json({ success: false, message: 'ServerError' });
      }
    }
  }
  @Get(':userId/avatar')
  async getAvatar(
    @Param('userId') userId: string,
    @Res() res,
  ): Promise<boolean> {
    const avatar = await this.userService.getAvatar(userId);
    if (avatar.length > 0) {
      res.json({
        success: true,
        message: 'avatar inserted to DB',
        url: avatar
      });
      return true;
    } else {
      res.json({
        success: false,
        message: 'avatar not found please, selecect less than 10 as param',
      });
    }
  }

  @Delete(':userId/avatar')
  async deleteUser(
    @Param('userId')
    userId: string,
    @Res() res,
  ): Promise<void> {
    try {
      const avatar = await this.userService.deleteById(userId);
      if (!avatar) {
        res.json({
          success: false,
          message: `Avatar with id ${userId} not found`,
        });
      } else {
        res.json({
          success: true,
          message: `Avatar with id ${userId} deleted`,
        });
      }
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        message: `Internal Server Error`,
      });
    }
  }
}
