import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      projectType,
      message,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Send email using Resend
    // NOTE: In test mode (without verified domain), Resend only allows sending to YOUR email
    const emailResponse = await resend.emails.send({
      from: "Darpan Interiors <onboarding@resend.dev>", // Using Resend's default domain
      to: ["kamalsinghjangra106@gmail.com"], // TESTING: Your Resend account email
      // to: [process.env.ADMIN_EMAIL || "info@darpaninteriors.com"], // PRODUCTION: Uncomment after domain verification
      subject: `New Consultation Booking - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">
            New Consultation Booking - Darpan Interiors
          </h2>
          
          <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #9a3412; margin-top: 0;">Client Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0c4a6e; margin-top: 0;">Consultation Preferences:</h3>
            <p><strong>Preferred Date:</strong> ${
              preferredDate || "Not specified"
            }</p>
            <p><strong>Preferred Time:</strong> ${
              preferredTime || "Not specified"
            }</p>
            <p><strong>Project Type:</strong> ${
              projectType || "Not specified"
            }</p>
          </div>

          ${
            message
              ? `
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Additional Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          `
              : ""
          }

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px;">
              Submitted at: ${new Date().toLocaleString()}
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              This email was sent from the Darpan Interiors consultation booking form.
            </p>
          </div>
        </div>
      `,
      text: `
New Consultation Booking - Darpan Interiors

Client Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || "Not provided"}
- Preferred Date: ${preferredDate || "Not specified"}
- Preferred Time: ${preferredTime || "Not specified"}
- Project Type: ${projectType || "Not specified"}

Additional Message:
${message || "None"}

---
Submitted at: ${new Date().toLocaleString()}
      `.trim(),
    });

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    // Send auto-reply confirmation email to the customer
    // NOTE: Disabled in test mode - Resend only allows sending to verified email in test mode
    // Uncomment after domain verification
    /*
    const autoReplyResponse = await resend.emails.send({
      from: "Darpan Interiors <onboarding@resend.dev>", // Change to your verified domain email
      to: [email],
      subject: "Consultation Booking Confirmed - Darpan Interiors",
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
                background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
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
                border-left: 4px solid #f59e0b;
                margin: 20px 0;
              }
              .appointment-details {
                background: #fff7ed;
                padding: 20px;
                border-radius: 5px;
                border: 2px solid #fdba74;
                margin: 20px 0;
              }
              .appointment-details h3 {
                color: #ea580c;
                margin-top: 0;
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
              <h1>🎉 Consultation Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              
              <p>Thank you for booking a consultation with <strong>Darpan Interiors</strong>! We're excited to help bring your design vision to life.</p>
              
              ${
                preferredDate || preferredTime
                  ? `<div class="appointment-details">
                <h3>📅 Your Requested Appointment</h3>
                ${preferredDate ? `<p><strong>Date:</strong> ${new Date(preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ""}
                ${preferredTime ? `<p><strong>Time:</strong> ${preferredTime}</p>` : ""}
                ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ""}
                <p style="color: #ea580c; margin-top: 15px;"><em>* We will contact you within 24 hours to confirm this appointment.</em></p>
              </div>`
                  : ""
              }
              
              <div class="highlight">
                <p><strong>What happens next?</strong></p>
                <ul>
                  <li>Our team will review your consultation request</li>
                  <li>We'll confirm your appointment via phone or email within 24 hours</li>
                  <li>You'll receive a calendar invitation with all the details</li>
                  <li>A dedicated designer will be assigned to your project</li>
                </ul>
              </div>
              
              <div class="highlight">
                <p><strong>During Your 60-Minute Consultation:</strong></p>
                <ul>
                  <li>✨ Discuss your design vision and style preferences</li>
                  <li>📐 Review your space and requirements</li>
                  <li>💡 Receive expert recommendations and initial concepts</li>
                  <li>📋 Understand the project timeline and investment</li>
                  <li>🎯 Get answers to all your questions</li>
                </ul>
              </div>
              
              <p>To make the most of your consultation, please prepare:</p>
              <ul>
                <li>Photos of your space (if available)</li>
                <li>Room measurements</li>
                <li>Inspiration images or Pinterest boards</li>
                <li>Your budget range</li>
                <li>Any specific requirements or concerns</li>
              </ul>
              
              <p>If you need to reschedule or have any questions before your consultation, please don't hesitate to contact us.</p>
              
              <div class="footer">
                <p><strong>Darpan Interiors</strong></p>
                <p>Transforming Spaces, Creating Dreams</p>
                <p>📧 info@darpaninteriors.com</p>
                <p style="font-size: 12px; color: #aaa; margin-top: 15px;">This is an automated confirmation. Please do not reply to this email directly.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Dear ${name},

Thank you for booking a consultation with Darpan Interiors! We're excited to help bring your design vision to life.

${
        preferredDate || preferredTime
          ? `Your Requested Appointment:
${preferredDate ? `Date: ${new Date(preferredDate).toLocaleDateString()}` : ""}
${preferredTime ? `Time: ${preferredTime}` : ""}
${projectType ? `Project Type: ${projectType}` : ""}

* We will contact you within 24 hours to confirm this appointment.
`
          : ""
      }

What happens next?
- Our team will review your consultation request
- We'll confirm your appointment via phone or email within 24 hours
- You'll receive a calendar invitation with all the details
- A dedicated designer will be assigned to your project

During Your 60-Minute Consultation:
- Discuss your design vision and style preferences
- Review your space and requirements
- Receive expert recommendations and initial concepts
- Understand the project timeline and investment
- Get answers to all your questions

To make the most of your consultation, please prepare:
- Photos of your space (if available)
- Room measurements
- Inspiration images or Pinterest boards
- Your budget range
- Any specific requirements or concerns

If you need to reschedule or have any questions before your consultation, please don't hesitate to contact us.

Best regards,
Darpan Interiors Team
Transforming Spaces, Creating Dreams

📧 info@darpaninteriors.com

---
This is an automated confirmation. Please do not reply to this email directly.
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
          "Consultation request received! We've sent a confirmation to your email and will contact you within 24 hours to confirm your appointment.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Consultation booking error:", error);
    return NextResponse.json(
      { error: "Failed to book consultation. Please try again." },
      { status: 500 }
    );
  }
}
