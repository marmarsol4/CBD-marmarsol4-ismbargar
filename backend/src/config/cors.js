import cors from 'cors';

const allowedOrigins = [
    'http://localhost:5173',
    'chrome-extension://eipdnjedkpcnlmmdfdkgfpljanehloah',
    'https://vrk28fp0-5173.uks1.devtunnels.ms',
  ];
  
const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    exposedHeaders: ['Access-Control-Allow-Origin']
  };

export default cors(corsOptions);