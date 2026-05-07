const defaultAllowedOrigins = [
    "http://localhost:5173",
    "https://chat-sphere-app-one.vercel.app",
    "https://chatsphere-app-omega.onrender.com",
];

const envAllowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ALLOWED_ORIGINS,
]
    .filter(Boolean)
    .flatMap((origin) => origin.split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];
const allowedOriginPatterns = [
    /^https:\/\/chat-sphere.*\.vercel\.app$/,
];

const isAllowedOrigin = (origin) => (
    allowedOrigins.includes(origin) ||
    allowedOriginPatterns.some((pattern) => pattern.test(origin))
);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || isAllowedOrigin(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
};

module.exports = { allowedOrigins, corsOptions };
