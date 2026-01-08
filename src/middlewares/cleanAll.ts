import sanitizeHtml from 'sanitize-html';
import { Request, Response, NextFunction } from 'express';

export const cleanAll = (req: Request, res: Response, next: NextFunction) => {
  const deepClean = (data: any): any => {
    if (typeof data === 'string') {
      return sanitizeHtml(data.trim());
    }

    if (Array.isArray(data)) {
      return data.map(item => deepClean(item));
    }

    if (data && typeof data === 'object') {
      const cleaned: any = {};
      for (const key in data) {
        cleaned[key] = deepClean(data[key]);
      }
      return cleaned;
    }

    return data;
  };

  // Solo modificamos el contenido, no la propiedad
  if (req.body) {
    Object.assign(req.body, deepClean(req.body));
  }

  if (req.query) {
    Object.assign(req.query, deepClean(req.query));
  }

  if (req.params) {
    Object.assign(req.params, deepClean(req.params));
  }

  next();
};
