const {resendClient, sender} = require("../lib/resend")
const createWelcomeEmailTemplate = require("./emailTemplate")

const sendWelcomeEmail = async (email, name, clientUrl) => {
    try {
        const {data, error} = await resendClient.emails.send({
            from: `${sender.name} <${sender.email}>`,
            to: email,
            subject: "Welcome to ChatSphere",
            html: createWelcomeEmailTemplate(name, clientUrl)
        })

        if (error) {
            console.error("Resend Error:", error);
            throw new Error(error.message || "Failed to send welcome email");
        }

        console.log("Welcome email sent successfully:", data.id);
    } catch (error) {
        console.error("Error in sendWelcomeEmail:", error);
        throw error;
    }

}

module.exports = sendWelcomeEmail;