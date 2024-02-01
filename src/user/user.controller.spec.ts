import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Avatar } from './schemas/avatar.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CryptoService } from '../crypto/crypto.service';
import { RabbitmqService } from '../lib/rabbitmq/rabbitmq.service';
import { SendMailService } from '../send-mail/send-mail.service';
describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  const testUser: CreateUserDto = {
    id: 1,
    email: 'george.bluth@reqres.in',
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
  };
  const id = '7';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        CryptoService,
        RabbitmqService,
        SendMailService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        {
          provide: getModelToken(Avatar.name),
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  describe('create', () => {
    it('should return User or Users', async () => {
      jest
        .spyOn(userService, 'create')
        .mockImplementation(() => Promise.resolve([testUser]));

      expect(await userService.create(testUser)).toStrictEqual([testUser]);
    });
  });
  describe('findById', () => {
    it('should return user with match id', async () => {
      jest
        .spyOn(userService, 'findById')
        .mockImplementation(() => Promise.resolve(testUser));
      expect(await userService.findById(id)).toBe(testUser);
    });
  });
  describe('retriveData', () => {
    it('should return reqresin array of objects', async () => {
      jest
        .spyOn(userService, 'retriveData')
        .mockImplementation(() => Promise.resolve(testUser));
      expect(await userService.retriveData(id)).toBe(testUser);
    });
  });
  describe('getAvatar', () => {
    it('should return reqresin  user objects', async () => {
      jest
        .spyOn(userService, 'getAvatar')
        .mockImplementation(() => Promise.resolve(id));
      expect(await userService.getAvatar(id)).toStrictEqual(expect.any(String));
    });
  });
  describe('deleteById', () => {
    it('should return reqresin array of objects', async () => {
      jest
        .spyOn(userService, 'deleteById')
        .mockImplementation(() => Promise.resolve(true));
      expect(await userService.deleteById(id)).toBe(true);
    });
  });

  // controller tests
  const response = {
    json: jest.fn(),
  };

  describe('createUser', () => {
    it('should return true', async () => {
      await userController.createUser(testUser, response);

      expect(response.json).toHaveBeenCalledWith({
        success: true,
        message: 'user created' || 'users fetched from API',
        users: expect.any(Object),
      });
    });
  });

  describe('getUsers', () => {
    it('should return true', async () => {
      await userController.getUsers(id, response);

      expect(response.json).toHaveBeenCalledWith({
        success: true,
        message: 'data fetched',
        data: expect.any(Object),
      });
    });
  });

  describe('getAvatar', () => {
    it('should return true', async () => {
      await userController.getAvatar(id, response);

      expect(response.json).toHaveBeenCalledWith({
        success: true,
        message: 'avatar inserted to DB',
        url: expect.any(String)
      });
    });
  });
  describe('deleteUser', () => {
    it('should return true', async () => {
      await userController.deleteUser(id, response);

      expect(response.json).toHaveBeenCalledWith({
        success: true,
        message: `Avatar with id ${id} deleted`,
      });
    });
  });
});
