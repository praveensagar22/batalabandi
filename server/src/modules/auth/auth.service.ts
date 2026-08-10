import crypto from 'crypto';
import { User, IUser } from './user.model';
import { RefreshToken } from './refreshToken.model';
import { AppError } from '../../utils/appError';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.utils';

export class AuthService {
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static async registerUser(data: { name: string; email: string; password?: string; role?: 'user' | 'admin' }) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('Email is already registered', 400);
    }

    const user = await User.create(data);
    user.password = undefined;

    const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id.toString(), role: user.role });

    const hashedRefreshToken = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      user: user._id,
      token: hashedRefreshToken,
      expiresAt,
    });

    return { user, accessToken, refreshToken };
  }

  static async loginUser(data: { email: string; password?: string }) {
    let user = await User.findOne({ email: data.email }).select('+password');

    // Auto-seed initial Admin user on first login attempt
    if (!user && data.email === 'admin@batalabandi.com') {
      await User.create({
        name: 'BatalaBandi Admin',
        email: 'admin@batalabandi.com',
        password: data.password || 'Admin@123',
        role: 'admin',
      });
      user = (await User.findOne({ email: data.email }).select('+password')) as any;
    }

    if (!user || !(await user.comparePassword(data.password!))) {
      throw new AppError('Invalid email or password', 401);
    }

    user.password = undefined;

    const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id.toString(), role: user.role });

    const hashedRefreshToken = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Delete existing refresh tokens for this user to enforce single-session or manage clean list
    await RefreshToken.deleteMany({ user: user._id });

    await RefreshToken.create({
      user: user._id,
      token: hashedRefreshToken,
      expiresAt,
    });

    return { user, accessToken, refreshToken };
  }

  static async refreshAccessToken(incomingRefreshToken: string) {
    let decoded;
    try {
      decoded = verifyRefreshToken(incomingRefreshToken);
    } catch (err) {
      throw new AppError('Invalid or expired Refresh Token', 401);
    }

    const hashedIncomingToken = this.hashToken(incomingRefreshToken);
    const storedToken = await RefreshToken.findOne({
      token: hashedIncomingToken,
      user: decoded.userId,
    });

    if (!storedToken) {
      throw new AppError('Refresh Token revoked or not found', 401);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User belonging to token no longer exists', 401);
    }

    // Generate new Access Token
    const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });

    return { accessToken, user };
  }

  static async logoutUser(incomingRefreshToken?: string, userId?: string) {
    if (incomingRefreshToken) {
      const hashed = this.hashToken(incomingRefreshToken);
      await RefreshToken.deleteOne({ token: hashed });
    } else if (userId) {
      await RefreshToken.deleteMany({ user: userId });
    }
  }
}
