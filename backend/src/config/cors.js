const allowedOrigins = [
    'http://localhost:5173',
    "https://vrk28fp0-5173.uks1.devtunnels.ms",
    'chrome-extension://eipdnjedkpcnlmmdfdkgfpljanehloah'
  ];
  
export const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true 
  };