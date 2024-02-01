import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AvatarSchema } from './schemas/avatar.schema';
import { RabbitmqService } from '../lib/rabbitmq/rabbitmq.service';
import { CryptoModule } from '../crypto/crypto.module';
import { SendMailModule } from '../send-mail/send-mail.module';
 
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Avatar', schema: AvatarSchema },
    ]),
    CryptoModule,
    SendMailModule
   ],
  controllers: [UserController],
  providers: [UserService, RabbitmqService],
})
export class UserModule {}
