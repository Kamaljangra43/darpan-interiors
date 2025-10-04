import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, projectType, message } = body;

    // Validate required fields
    if (!firstName || !email || !message) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: Name, Email, and Message are required.",
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format." },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long. Please keep it under 5000 characters." },
        { status: 400 }
      );
    }

    // Send notification email to admin (your GoDaddy email)
    // NOTE: In test mode (without verified domain), Resend only allows sending to YOUR email
    // Change to process.env.ADMIN_EMAIL once domain is verified
    const adminEmailResponse = await resend.emails.send({
      from: "Darpan Interiors <onboarding@resend.dev>", // Change this to your verified domain email once set up
      to: ["kamalsinghjangra106@gmail.com"], // TESTING: Your Resend account email
      // to: [process.env.ADMIN_EMAIL || "info@darpaninteriors.com"], // PRODUCTION: Uncomment after domain verification
      replyTo: email, // Allow direct reply to the customer
      subject: `🏠 New Contact Form Submission - ${firstName} ${
        lastName || ""
      }`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .field {
                margin-bottom: 15px;
                padding: 15px;
                background: white;
                border-radius: 5px;
                border-left: 4px solid #667eea;
              }
              .label {
                font-weight: bold;
                color: #667eea;
                display: block;
                margin-bottom: 5px;
              }
              .value {
                color: #555;
              }
              .message-box {
                background: white;
                padding: 20px;
                border-radius: 5px;
                border-left: 4px solid #764ba2;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <span class="value">${firstName} ${lastName || ""}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
              </div>
              ${
                phone
                  ? `<div class="field">
                <span class="label">Phone:</span>
                <span class="value">${phone}</span>
              </div>`
                  : ""
              }
              ${
                projectType
                  ? `<div class="field">
                <span class="label">Project Type:</span>
                <span class="value">${projectType}</span>
              </div>`
                  : ""
              }
              <div class="message-box">
                <span class="label">Message:</span>
                <p class="value">${message}</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${firstName} ${lastName || ""}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
${projectType ? `Project Type: ${projectType}` : ""}

Message:
${message}
      `,
    });

    if (adminEmailResponse.error) {
      console.error("Resend admin email error:", adminEmailResponse.error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    // Send auto-reply email to the customer
    // NOTE: Disabled in test mode - Resend only allows sending to verified email in test mode
    // Uncomment after domain verification
    /* 
    const autoReplyResponse = await resend.emails.send({
      from: "Darpan Interiors <onboarding@resend.dev>", // Change this to your verified domain email
      to: [email],
      subject: "Thank you for contacting Darpan Interiors",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .content p {
                margin: 15px 0;
                color: #555;
              }
              .highlight {
                background: white;
                padding: 20px;
                border-radius: 5px;
                border-left: 4px solid #667eea;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e0e0e0;
                color: #888;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🏠 Thank You for Contacting Us!</h1>
            </div>
            <div class="content">
              <p>Dear ${firstName},</p>
              
              <p>Thank you for reaching out to <strong>Darpan Interiors</strong>! We have received your inquiry and appreciate your interest in our interior design services.</p>
              
              <div class="highlight">
                <p><strong>What happens next?</strong></p>
                <ul>
                  <li>Our team will review your message within the next 24 hours</li>
                  <li>A dedicated designer will reach out to discuss your project</li>
                  <li>We'll schedule a consultation to understand your vision</li>
                </ul>
              </div>
              
              <p>Your inquiry details:</p>
              <div class="highlight">
                <p><strong>Message:</strong> ${message.substring(0, 200)}${
        message.length > 200 ? "..." : ""
      }</p>
              </div>
              
              <p>In the meantime, feel free to explore our portfolio and previous projects on our website.</p>
              
              <p>If you have any urgent questions, please don't hesitate to call us directly.</p>
              
              <div class="footer">
                <p><strong>Darpan Interiors</strong></p>
                <p>Transforming Spaces, Creating Dreams</p>
                <p style="font-size: 12px; color: #aaa;">This is an automated response. Please do not reply to this email directly.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Dear ${firstName},

Thank you for reaching out to Darpan Interiors! We have received your inquiry and appreciate your interest in our interior design services.

What happens next?
- Our team will review your message within the next 24 hours
- A dedicated designer will reach out to discuss your project
- We'll schedule a consultation to understand your vision

Your inquiry: ${message}

In the meantime, feel free to explore our portfolio and previous projects on our website.

Best regards,
Darpan Interiors Team
Transforming Spaces, Creating Dreams

---
This is an automated response. Please do not reply to this email directly.
      `,
    });

    // Log auto-reply errors but don't fail the request
    if (autoReplyResponse.error) {
      console.error("Resend auto-reply error:", autoReplyResponse.error);
    }
    */

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for your inquiry! We've sent a confirmation to your email and will get back to you within 24 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
