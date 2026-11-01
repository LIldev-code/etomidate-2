import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendContactNotification({ name, email, subject, message }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 12px; overflow: hidden;">
      <div style="background: #10b981; padding: 20px 30px;">
        <h1 style="margin: 0; color: #000; font-size: 20px;">📩 New Contact Message</h1>
      </div>
      <div style="padding: 30px;">
        <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 5px;">From</p>
        <p style="color: #ccc; margin-top: 0;">${name} (${email})</p>

        <hr style="border: none; border-top: 1px solid #262626; margin: 15px 0;" />

        <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Subject</p>
        <p style="color: #ccc; margin-top: 0;">${subject || "General Inquiry"}</p>

        <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Message</p>
        <p style="color: #ccc; margin-top: 0; white-space: pre-wrap;">${message}</p>

        <hr style="border: none; border-top: 1px solid #262626; margin: 15px 0;" />
        <p style="color: #666; font-size: 12px; text-align: center;">You can reply directly to this email to respond to the customer.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"BuyEtomidateProducts" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
      replyTo: email,
      subject: `Contact: ${subject || "General Inquiry"} — from ${name}`,
      html,
    });
    console.log(`Contact notification sent for ${name}`);
  } catch (err) {
    console.error("Failed to send contact email:", err.message);
  }
}

export async function sendOrderNotification(order) {
  const { orderId, productName, size, price, customerName, orderVia, shippingAddress, message } = order;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 12px; overflow: hidden;">
      <div style="background: #10b981; padding: 20px 30px;">
        <h1 style="margin: 0; color: #000; font-size: 20px;">🛒 New Order Received!</h1>
      </div>
      <div style="padding: 30px;">
        <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Order ID</p>
        <p style="color: #ccc; margin-top: 0;">${orderId}</p>

        <hr style="border: none; border-top: 1px solid #262626; margin: 15px 0;" />

        <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Product</p>
        <p style="color: #ccc; margin-top: 0;">${productName} — ${size}</p>

        <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Price</p>
        <p style="color: #ccc; margin-top: 0; font-size: 22px; font-weight: bold;">€${typeof price === 'number' ? price.toFixed(2) : price}</p>

        <hr style="border: none; border-top: 1px solid #262626; margin: 15px 0;" />

        <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Customer</p>
        <p style="color: #ccc; margin-top: 0;">${customerName}</p>

        <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Ordered Via</p>
        <p style="color: #ccc; margin-top: 0;">${orderVia === "whatsapp" ? "WhatsApp" : orderVia === "telegram" ? "Telegram" : orderVia || "—"}</p>

        <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Shipping Address</p>
        <p style="color: #ccc; margin-top: 0;">${shippingAddress}</p>

        ${message ? `
        <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Customer Message</p>
        <p style="color: #ccc; margin-top: 0; white-space: pre-wrap;">${message}</p>
        ` : ''}

        <hr style="border: none; border-top: 1px solid #262626; margin: 15px 0;" />
        <p style="color: #666; font-size: 12px; text-align: center;">This is an automated notification from BuyEtomidateProducts</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"BuyEtomidateProducts" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
      subject: `New Order ${orderId} — ${productName} (€${typeof price === 'number' ? price.toFixed(2) : price})`,
      html,
    });
    console.log(`Order notification sent for ${orderId}`);
  } catch (err) {
    console.error("Failed to send order email:", err.message);
  }
}
