import { Router, Request, Response } from 'express';
import { upload } from '../../middleware/upload.middleware';

const router = Router();

// POST /api/v1/upload - Upload single image file
router.post('/', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'fail',
      message: 'No file uploaded',
    });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    status: 'success',
    data: {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    },
  });
});

// POST /api/v1/upload/multiple - Upload multiple image files (up to 5)
router.post('/multiple', upload.array('photos', 5), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'No files uploaded',
    });
  }

  const urls = files.map((file) => `/uploads/${file.filename}`);

  res.status(200).json({
    status: 'success',
    data: {
      urls,
      count: urls.length,
    },
  });
});

export default router;
