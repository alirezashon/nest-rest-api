import { Injectable } from '@nestjs/common';
import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

@Injectable()
export class CryptoService {
  generateKeyAndIV(): { secretKey: string; iv: string } {
    const secretKey = randomBytes(32).toString('hex');
    const iv =randomBytes(16).toString('hex');
    return { secretKey, iv };
  }

  encryptText(text: string, secretKey: string, iv: string): string {
    const cipher = createCipheriv(
      'aes-256-cbc',
      Buffer.from(secretKey, 'hex'),
      Buffer.from(iv, 'hex'),
    );
    let encryptedData = cipher.update(text, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
  }

  decryptText(encryptedText: string, secretKey: string, iv: string) {
    const decipher = createDecipheriv(
      'aes-256-cbc',
      Buffer.from(secretKey, 'hex'),
      Buffer.from(iv, 'hex'),
    );
    let decryptedData = decipher.update(encryptedText, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return decryptedData;
  }
}











