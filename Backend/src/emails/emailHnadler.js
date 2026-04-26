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
    } catch (error) {
        console.log("Error in sendWelcomeEmail:", error);
        if(error){
            throw new Error("Failed to send welcome email");
        }
    }

}

module.exports = sendWelcomeEmail;