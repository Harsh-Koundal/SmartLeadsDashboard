import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { IUser, UserRole } from '../types';
import { AppError } from '../middlewares/error.middleware';

const userRepository = new UserRepository();

export class AuthService {
  async register(userData: Partial<IUser>) {
    const existingUser = await userRepository.findByEmail(userData.email!);
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password!, salt);

    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const token = this.generateToken((user._id as any).toString(), user.role);

    return {
      user: {
        id: user._id as any,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken((user._id as any).toString(), user.role);

    return {
      user: {
        id: user._id as any,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  private generateToken(id: string, role: UserRole) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });
  }
}
