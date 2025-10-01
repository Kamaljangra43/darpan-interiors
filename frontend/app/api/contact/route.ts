import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, projectType, message } = body

    // Validate required fields
    if (!firstName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Darpan Interiors <noreply@resend.dev>", // Using Resend's default domain
      to: ["kamalsinghjangra106@gmail.com"],
      subject: `New Contact Form Submission - ${firstName} ${lastName || ""}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">
            New Contact Form Submission - Darpan Interiors
          </h2>
          
          <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #9a3412; margin-top: 0;">Client Details:</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName || ""}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Project Type:</strong> ${projectType || "Not specified"}</p>
          </div>

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px;">
              Submitted at: ${new Date().toLocaleString()}
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              This email was sent from the Darpan Interiors contact form.
            </p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission - Darpan Interiors

Client Details:
- Name: ${firstName} ${lastName || ""}
- Email: ${email}
- Phone: ${phone || "Not provided"}
- Project Type: ${projectType || "Not specified"}

Message:
${message}

---
Submitted at: ${new Date().toLocaleString()}
      `.trim(),
    })

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error)
      return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your inquiry! We will get back to you within 24 hours.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}
