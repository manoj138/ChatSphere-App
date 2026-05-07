const mongoose = require("mongoose");

const atlasDirectHosts = {
    "cluster0.e2juknp.mongodb.net": [
        "ac-isay4uk-shard-00-00.e2juknp.mongodb.net:27017",
        "ac-isay4uk-shard-00-01.e2juknp.mongodb.net:27017",
        "ac-isay4uk-shard-00-02.e2juknp.mongodb.net:27017",
    ],
};

const buildDirectAtlasUri = (uri) => {
    if (!uri?.startsWith("mongodb+srv://")) return null;

    const parsedUri = new URL(uri);
    const directHosts = atlasDirectHosts[parsedUri.hostname];
    if (!directHosts) return null;

    const credentials = parsedUri.username
        ? `${parsedUri.username}${parsedUri.password ? `:${parsedUri.password}` : ""}@`
        : "";
    const params = parsedUri.searchParams;

    if (!params.has("authSource")) params.set("authSource", "admin");
    if (!params.has("replicaSet")) params.set("replicaSet", "atlas-otpn89-shard-0");
    if (!params.has("tls") && !params.has("ssl")) params.set("tls", "true");

    return `mongodb://${credentials}${directHosts.join(",")}${parsedUri.pathname}?${params.toString()}`;
};

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    try {
        const conn = await mongoose.connect(mongoUri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        const directUri = buildDirectAtlasUri(mongoUri);
        const isSrvDnsError = ["ECONNREFUSED", "ETIMEOUT", "ENOTFOUND", "EAI_AGAIN"].includes(error.code);

        if (directUri && isSrvDnsError) {
            try {
                const conn = await mongoose.connect(directUri);
                console.log(`MongoDB Connected: ${conn.connection.host}`);
                return;
            } catch (directError) {
                console.error("MongoDB direct connection error:", directError.message);
            }
        }

        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
