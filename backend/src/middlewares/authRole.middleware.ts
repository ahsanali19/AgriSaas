// backend/src/middlewares/authRole.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedAdminRequest extends Request {
  user?: {
    userId: number;
    phoneNumber: string;
    role: 'admin' | 'farmer' | 'manager' | 'worker';
    isSuperAdmin?: boolean;
  };
}

/**
 * Middleware: Verify Bearer JWT and validate that user has one of the allowed roles (e.g. 'admin')
 */
export const requireRole = (allowedRoles: ('admin' | 'farmer' | 'manager' | 'worker')[] = ['admin']) => {
  return (req: AuthenticatedAdminRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access Denied: Missing or invalid authorization token.'
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'agrisaas_secure_jwt_secret_key_2026';

    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        userId: number;
        phoneNumber: string;
        role: 'admin' | 'farmer' | 'manager' | 'worker';
        isSuperAdmin?: boolean;
      };

      req.user = decoded;

      // Role check
      if (!allowedRoles.includes(decoded.role)) {
        res.status(403).json({
          success: false,
          message: `Forbidden: This resource requires [${allowedRoles.join(', ')}] privileges.`
        });
        return;
      }

      next();
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: 'Invalid, forged, or expired session token.'
      });
      return;
    }
  };
};
