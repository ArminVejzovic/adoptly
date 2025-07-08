import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const sendEmailWithAttachment = async ({ to, subject, htmlContent, name, attachments }) => {
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
  sendSmtpEmail.to = [{ email: to, name: name || "" }];
  sendSmtpEmail.attachment = attachments;

  const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
  console.log("✅ Email with attachment sent:", response);
  return response;
};

export default sendEmailWithAttachment;
