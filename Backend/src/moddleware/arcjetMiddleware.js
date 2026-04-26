const aj = require("../lib/arcjet");
const { isSpoofedBot } = require("@arcjet/inspect");

const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    // 🚫 Denied cases
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          success: false,
          message: "Too many requests",
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({
          success: false,
          message: "Bot access denied",
        });
      }

      return res.status(403).json({
        success: false,
        message: "Access denied by security policy",
      });
    }

    // 🚫 Spoofed bot check (only if NOT denied above)
    if (decision.results?.some(isSpoofedBot)) {
      return res.status(403).json({
        success: false,
        message: "Spoofed bot access denied",
      });
    }

    // ✅ Allowed
    next();

  } catch (error) {
    console.log("Error in arcjetProtection:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = arcjetProtection;