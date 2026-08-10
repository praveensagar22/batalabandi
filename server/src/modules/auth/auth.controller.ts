import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { AppError } from '../../utils/appError';

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export class AuthController {
  static register = catchAsync(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await AuthService.registerUser(req.body);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user,
        accessToken,
        refreshToken, // Sent in body for Postman / mobile clients
      },
    });
  });

  static login = catchAsync(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await AuthService.loginUser(req.body);
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        user,
        accessToken,
        refreshToken, // Sent in body for Postman / mobile clients
      },
    });
  });

  static refreshToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const { accessToken, user } = await AuthService.refreshAccessToken(refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Access token refreshed successfully',
      data: {
        accessToken,
        user,
      },
    });
  });

  static logout = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    await AuthService.logoutUser(refreshToken, req.user?._id?.toString());

    res.clearCookie('refreshToken');

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  });

  static getMe = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  });
}
