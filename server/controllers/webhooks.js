import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // ensure webhook secret exists
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET in .env");
    }

    const whook = new Webhook(secret);

    const payload = JSON.stringify(req.body);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // verify webhook
    const evt = await whook.verify(payload, headers);
    const { data, type } = evt;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
          resume: "",
        };
        await User.create(userData);
        return res.json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        return res.json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.json({ success: true });
      }

      default:
        return res.json({ success: false, message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};
