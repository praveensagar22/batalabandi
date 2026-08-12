import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { verifyAccessToken } from '../utils/jwt.utils';
import { User, IUser } from '../modules/auth/user.model';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const protect = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to perform checkout or view your profile.', 401)
      );
    }

    try {
      const decoded = verifyAccessToken(token);
      const currentUser = await User.findById(decoded.userId);
      if (currentUser) {
        req.user = currentUser;
      } else {
        return next(
          new AppError('The user belonging to this token no longer exists.', 401)
        );
      }
    } catch (err) {
      return next(
        new AppError('Invalid or expired session token. Please log in again.', 401)
      );
    }

    next();
  }
);

export const restrictTo = (...roles: Array<'user' | 'admin'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
