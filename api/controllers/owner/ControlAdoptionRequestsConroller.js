import AdoptionRequest from "../../models/AdoptionRequest.js";
import { sendEmail } from "../../utils/emailService.js";

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
      .populate("animal", "name");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await sendEmail({
      to: request.requester.email,
      subject: "Adoption Request Approved",
      htmlContent: `
        <html>
          <body>
            <p>Hello ${request.requester.username},</p>
            <p>Good news! Your adoption request for the animal "<strong>${request.animal?.name}</strong>" has been <strong>APPROVED</strong>.</p>
            <p>Please log in to your account for further details.</p>
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
      .json({ message: "Server error while approving request" });
  }
};

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
