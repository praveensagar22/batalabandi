import { Response } from 'express';
import { AdminService } from './admin.service';
import { catchAsync } from '../../utils/catchAsync';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class AdminController {
  static getStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const stats = await AdminService.getDashboardStats();
    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  });

  static getUsers = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const users = await AdminService.getAllUsers();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  });

  static updateUserRole = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { role } = req.body;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = await AdminService.updateUserRole(id, role);
    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully',
      data: { user },
    });
  });
}
