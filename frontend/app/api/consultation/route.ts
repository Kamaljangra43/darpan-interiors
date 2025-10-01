import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, preferredDate, preferredTime, projectType, message } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Darpan Interiors <noreply@resend.dev>", // Using Resend's default domain
      to: ["kamalsinghjangra106@gmail.com"],
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
            <p><strong>Preferred Date:</strong> ${preferredDate || "Not specified"}</p>
            <p><strong>Preferred Time:</strong> ${preferredTime || "Not specified"}</p>
            <p><strong>Project Type:</strong> ${projectType || "Not specified"}</p>
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
    })

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error)
      return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Consultation request received! We will contact you within 24 hours to confirm your appointment.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Consultation booking error:", error)
    return NextResponse.json({ error: "Failed to book consultation. Please try again." }, { status: 500 })
  }
}
