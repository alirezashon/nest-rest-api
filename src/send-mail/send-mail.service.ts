import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
@Injectable()
export class SendMailService {
  async sendMail(): Promise<{ props: {} }> {
    const transporter = nodemailer.createTransport({
      host: 'alirezafeshki2017@gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'alirezafeshki2017@gmail.com',
        pass: 'alireza1380',
      },
    });

    await transporter.sendMail({
      from: 'alirezafeshki2017@gmail.com',
      to: 'forever@gmail.com',
      subject: 'Test email',
      text: 'new user created',
    });

    return {
      props: {},
    };
  }
}
