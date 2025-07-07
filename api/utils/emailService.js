import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

console.log("BREVO_API_KEY =", process.env.BREVO_API_KEY);
console.log("BREVO_FROM_EMAIL =", process.env.BREVO_FROM_EMAIL);

export const sendEmail = async ({ to, subject, htmlContent, name }) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = {
    name: "Adoptly Support",
    email: process.env.BREVO_FROM_EMAIL,
  };
  sendSmtpEmail.to = [
    {
      email: to,
      name: name || "",
    },
  ];

  const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
  console.log("✅ Transactional email sent:", response);
  return response;
};

export default sendEmail;
