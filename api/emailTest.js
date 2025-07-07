import { sendEmail } from "./utils/emailService.js";

(async () => {
  try {
    await sendEmail({
      to: "vv@gmail.com",
      subject: "Hello from Adoptly 🚀",
      htmlContent:
        "<html><body><h1>Test email from reusable service!</h1></body></html>",
      name: "V V",
    });
  } catch (error) {
    console.error("Email sending failed.", error);
  }
})();
