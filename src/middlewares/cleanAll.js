import sanitizeHtml from 'sanitize-html';

export const cleanAll = (req, res, next) => {
  const deepClean = (data) => {
    if (typeof data === 'string') {
      return sanitizeHtml(data.trim());
    }

    if (Array.isArray(data)) {
      return data.map(item => deepClean(item));
    }

    if (data && typeof data === 'object') {
      const cleaned = {};
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
