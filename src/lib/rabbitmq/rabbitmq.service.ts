import * as amqp from 'amqplib';

export class RabbitmqService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect(): Promise<void> {
    this.connection = await amqp.connect('amqp://185.19.201.25');
    this.channel = await this.connection.createChannel();
  }

  async sendMessage(queue: string, message: string): Promise<void> {
    await this.channel.assertQueue(queue, { durable: false });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async closeConnection(): Promise<void> {
    await this.connection.close();
  }
}
