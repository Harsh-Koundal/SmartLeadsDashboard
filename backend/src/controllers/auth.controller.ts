import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../types';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      const response: ApiResponse = {
        success: true,
        message: 'User registered successfully',
        data: result,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: result,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
