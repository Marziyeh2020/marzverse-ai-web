import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      company = "",
      service,
      details,
      consent,
      hp, // honeypot field
    } = body;

    // Honeypot check: If filled, bot detected. Safely reject.
    if (hp && typeof hp === "string" && hp.trim().length > 0) {
      return NextResponse.json(
        { success: false, error: "Invalid submission." },
        { status: 400 }
      );
    }

    // Sanitize and trim
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedCompany = typeof company === "string" ? company.trim() : "";
    const trimmedService = typeof service === "string" ? service.trim() : "";
    const trimmedDetails = typeof details === "string" ? details.trim() : "";
    const isConsentGiven = consent === true || consent === "true";

    // Required fields check
    if (!trimmedName || !trimmedEmail || !trimmedService || !trimmedDetails) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!isConsentGiven) {
      return NextResponse.json(
        { success: false, error: "Please agree to the privacy consent to continue." },
        { status: 400 }
      );
    }

    // Length checks
    if (trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, error: "Name must not exceed 100 characters." },
        { status: 400 }
      );
    }

    if (trimmedEmail.length > 254 || !EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (trimmedCompany.length > 150) {
      return NextResponse.json(
        { success: false, error: "Company name must not exceed 150 characters." },
        { status: 400 }
      );
    }

    if (trimmedService.length > 100) {
      return NextResponse.json(
        { success: false, error: "Service selection must not exceed 100 characters." },
        { status: 400 }
      );
    }

    if (trimmedDetails.length > 3000) {
      return NextResponse.json(
        { success: false, error: "Project details must not exceed 3000 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[Contact API] RESEND_API_KEY is not configured.");
      return NextResponse.json(
        {
          success: false,
          error: "Email service is temporarily unavailable. Please reach us directly via WhatsApp or email.",
        },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const toEmail = process.env.CONTACT_TO_EMAIL || "contact@marzverse.com";
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "MarzVerse Website <contact@marzverse.com>";
    const submissionDate = new Date().toUTCString();

    const escapedName = escapeHtml(trimmedName);
    const escapedEmail = escapeHtml(trimmedEmail);
    const escapedCompany = trimmedCompany ? escapeHtml(trimmedCompany) : "Not provided";
    const escapedService = escapeHtml(trimmedService);
    const escapedDetails = escapeHtml(trimmedDetails).replace(/\n/g, "<br />");

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050505; color: #F5F5F5; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0B0B0B; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 32px; }
    .header { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 24px; }
    .title { color: #FF6A00; font-size: 20px; font-weight: 600; margin: 0 0 8px 0; }
    .subtitle { color: #A3A3A3; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0; }
    .field { margin-bottom: 20px; }
    .label { font-size: 12px; color: #A3A3A3; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
    .value { font-size: 15px; color: #F5F5F5; line-height: 1.6; }
    .details-box { background-color: #141414; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 16px; margin-top: 6px; font-size: 14px; color: #E5E5E5; line-height: 1.65; white-space: pre-wrap; }
    .footer { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 18px; margin-top: 28px; font-size: 12px; color: #737373; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">New Project Request</h1>
      <p class="subtitle">Source: MarzVerse Website</p>
    </div>

    <div class="field">
      <div class="label">Client Name</div>
      <div class="value"><strong>${escapedName}</strong></div>
    </div>

    <div class="field">
      <div class="label">Email Address</div>
      <div class="value"><a href="mailto:${escapedEmail}" style="color: #FF6A00; text-decoration: none;">${escapedEmail}</a></div>
    </div>

    <div class="field">
      <div class="label">Company</div>
      <div class="value">${escapedCompany}</div>
    </div>

    <div class="field">
      <div class="label">Requested Service</div>
      <div class="value" style="color: #FF6A00; font-weight: 500;">${escapedService}</div>
    </div>

    <div class="field">
      <div class="label">Project Details & Goals</div>
      <div class="details-box">${escapedDetails}</div>
    </div>

    <div class="footer">
      <span>Submitted on ${submissionDate}</span>
    </div>
  </div>
</body>
</html>
    `.trim();

    const plainTextContent = `
New MarzVerse Project Request — ${trimmedName}
==============================================

Client Name: ${trimmedName}
Email: ${trimmedEmail}
Company: ${trimmedCompany || "Not provided"}
Requested Service: ${trimmedService}

Project Details:
----------------
${trimmedDetails}

----------------------------------------------
Submission Date: ${submissionDate}
Source: MarzVerse Website
    `.trim();

    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: trimmedEmail,
      subject: `New MarzVerse Project Request — ${trimmedName}`,
      text: plainTextContent,
      html: htmlContent,
    });

    if (result.error) {
      console.error("[Contact API] Resend error:", result.error.message);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send your request. Please try again or reach out on WhatsApp.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your project request has been sent successfully.",
    });
  } catch (err: unknown) {
    console.error("[Contact API] Unexpected error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again or contact us directly.",
      },
      { status: 500 }
    );
  }
}
