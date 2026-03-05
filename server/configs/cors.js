const LOCAL_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

const parseOrigins = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const getAllowedOrigins = () =>
  Array.from(
    new Set([
      ...parseOrigins(process.env.FRONTEND_URL),
      ...LOCAL_ORIGINS,
    ]),
  );

export const isAllowedOrigin = (origin) =>
  !origin || getAllowedOrigins().includes(origin);

export const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};
