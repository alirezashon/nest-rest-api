import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Avatar } from './schemas/avatar.schema';
import * as mongoose from 'mongoose';
import { CryptoService } from '../crypto/crypto.service';
import { SendMailService } from '../send-mail/send-mail.service';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User>,
    @InjectModel(Avatar.name)
    private readonly avatarModel: mongoose.Model<Avatar>,
    private readonly cryptography: CryptoService,
    private readonly sendMail: SendMailService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ id: id });
    return user;
  }

  async create(user: User): Promise<User[]> {
    
    if (Object.keys(user).length > 0) {
      const createUser = await this.userModel.create(user);
      console.log('user');
      return [createUser];
    } else {
      const createUsers = await fetch('https://reqres.in/api/users', {});
      const users = await createUsers.json();
      users.data.map(
        async (user: Promise<User>) => await this.userModel.create(user),
      );
      this.sendMail.sendMail();
      return users.data;
    }
  }

  async retriveData(userId: string): Promise<User> {
    const response = await fetch(
      `https://reqres.in/api/users?id=${userId}`,
      {},
    );
    const responseData = await response.json();
    if (!responseData.data) {
      throw new NotFoundException('user does not exist');
    }
    return responseData;
  }

  async getAvatar(userId: string): Promise<string> {
    const response = await fetch(
      `https://reqres.in/img/faces/${userId}-image.jpg`,
    );
    const blob = await response.blob();
    const buffer = Buffer.from(await blob.text());
    const base64Image = buffer.toString('base64');
    const imagePath = 'D:personal';

    require('fs').writeFileSync(imagePath, buffer);
    if (blob.type.match('image')) {
      const { secretKey, iv } = this.cryptography.generateKeyAndIV();
      const encryptionData = this.cryptography.encryptText(
        base64Image,
        secretKey,
        iv,
      );
      const decryptedText = this.cryptography.decryptText(
        encryptionData,
        secretKey,
        iv,
      );
      console.log(
        'Crypto & hash =======================================>',
        encryptionData,
      );
      console.log(
        'Image ===============================================>',
        base64Image,
      );
      console.log(
        'decrypted ===========================================>',
        decryptedText,
      );
      await this.avatarModel.create({
        image: encryptionData,
        userId: userId,
        keyV: secretKey + '&' + iv,
      });
      return encryptionData;
    }
    return '';
  }

  async deleteById(userId: string): Promise<boolean> {
    const avatar = await this.avatarModel.findOneAndDelete({ userId: userId });
    console.info(avatar);
    return avatar ? true : false;
  }
}
