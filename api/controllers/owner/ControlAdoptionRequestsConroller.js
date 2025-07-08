import AdoptionRequest from "../../models/AdoptionRequest.js";
import PDFDocument from 'pdfkit';
import PDFContract from '../../models/PDFContract.js';
import { sendEmail } from '../../utils/emailService.js';
import sendEmailWithAttachment from "../../utils/sendEmailWithAttachment.js";

export const getMyAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ owner: req.user._id })
      .populate("animal requester", "name username email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while fetching requests" });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const request = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { status: "approved", decisionDate: new Date() },
      { new: true }
    )
      .populate("requester", "username email")
      .populate({
        path: "animal",
        select: "name owner",
        populate: { path: "owner", select: "username email" },
      });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const pdfBuffer = await generatePDFContract(request);

    const pdfContract = new PDFContract({
      application: request._id,
      pdfData: pdfBuffer,
    });
    await pdfContract.save();

    // 📩 Email za udomitelja
    await sendEmailWithAttachment({
      to: request.requester.email,
      subject: "Adoption Request Approved",
      htmlContent: `
        <html>
          <body>
            <p>Hello ${request.requester.username},</p>
            <p>Your adoption request for animal <strong>${request.animal?.name}</strong> has been <strong>APPROVED</strong>.</p>
            <p>Please find attached your adoption agreement.</p>
            <p>Log in to your Adoptly account and contact the owner <strong>${request.animal.owner.username}</strong> via chat to finalize the adoption process.</p>
            <p>Thank you for choosing Adoptly!</p>
          </body>
        </html>
      `,
      attachments: [
        {
          name: 'adoption_contract.pdf',
          content: pdfBuffer.toString('base64'),
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
      name: request.requester.username,
    });

    // 📩 Email za vlasnika
    await sendEmailWithAttachment({
      to: request.animal.owner.email,
      subject: "Copy of Adoption Agreement",
      htmlContent: `
        <html>
          <body>
            <p>Hello ${request.animal.owner.username},</p>
            <p>The adoption request for your animal <strong>${request.animal?.name}</strong> has been <strong>APPROVED</strong>.</p>
            <p>Attached is a copy of the adoption agreement for your records.</p>
            <p>You can now contact the adopter <strong>${request.requester.username}</strong> via chat on Adoptly to arrange the handover.</p>
            <p>Thank you for being part of the Adoptly community!</p>
          </body>
        </html>
      `,
      attachments: [
        {
          name: 'adoption_contract.pdf',
          content: pdfBuffer.toString('base64'),
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
      name: request.animal.owner.username,
    });

    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while approving request" });
  }
};

export async function generatePDFContract(request) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    doc.fontSize(24).text("Adoptly Adoption Agreement", {
      align: "center",
      underline: true,
    });

    doc.moveDown(2);

    doc.fontSize(12).text(
      `This agreement certifies the completion of the animal adoption process through the Adoptly platform, in accordance with its rules and terms of use. All parties hereby agree to the contents of this document.`,
      { align: "justify" }
    );

    doc.moveDown(2);

    doc.fontSize(14).text("Adoption Details:", { underline: true });

    doc.moveDown();
    doc.fontSize(12).text(`• Animal: ${request.animal?.name}`);
    doc.text(`• Owner: ${request.animal.owner?.username}`);
    doc.text(`• Adopter: ${request.requester.username}`);

    doc.moveDown(2);

    doc.fontSize(14).text("Adoption Terms:", { underline: true });

    doc.moveDown();
    doc.fontSize(12).text(
      `1. The adopter agrees to provide adequate living conditions, care, and healthcare for the adopted animal.\n` +
      `2. The adopter may not sell, transfer, or gift the animal to a third party without prior consultation with the owner.\n` +
      `3. The owner guarantees that the animal is healthy (unless otherwise specified) and that all known data has been accurately provided within the Adoptly platform.\n` +
      `4. Both parties agree that all communication and possible follow-ups will be conducted through the Adoptly platform.\n`
    );

    doc.moveDown(2);

    doc.fontSize(14).text("Agreement Confirmation:", { underline: true });

    doc.moveDown();
    doc.fontSize(12).text(
      `This agreement was concluded electronically via the Adoptly platform on ${new Date().toLocaleDateString()}.\n\n` +
      `Signatories:`
    );

    doc.moveDown(2);

    doc.text(`__________________________`, { align: "left" });
    doc.text(`Owner: ${request.animal.owner?.username}`, { align: "left" });

    doc.moveDown(2);

    doc.text(`__________________________`, { align: "left" });
    doc.text(`Adopter: ${request.requester.username}`, { align: "left" });

    doc.moveDown(4);

    doc.fontSize(10).fillColor("gray").text(
      "Adoptly | Animal Adoption Web Platform\nAll rights reserved © 2025.",
      { align: "center" }
    );

    doc.end();
  });
}

export const rejectRequest = async (req, res) => {
  try {
    const request = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", decisionDate: new Date() },
      { new: true }
    )
      .populate("requester", "username email")
      .populate("animal", "name");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await sendEmail({
      to: request.requester.email,
      subject: "Adoption Request Rejected",
      htmlContent: `
        <html>
          <body>
            <p>Hello ${request.requester.username},</p>
            <p>Unfortunately, your adoption request for the animal "<strong>${request.animal?.name}</strong>" has been <strong>REJECTED</strong>.</p>
            <p>We encourage you to browse other animals available for adoption.</p>
            <p>For any questions or concerns, please don't hesitate to contact us.</p>
            <p>Thank you for choosing Adoptly!</p>
            <p>Best regards,<br/>Adoptly Team</p>
          </body>
        </html>
      `,
      name: request.requester.username,
    });

    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while rejecting request" });
  }
};
