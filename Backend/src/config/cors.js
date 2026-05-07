const defaultAllowedOrigins = [
    "http://localhost:5173",
    "https://chat-sphere-app-one.vercel.app",
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

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
};

module.exports = { allowedOrigins, corsOptions };
