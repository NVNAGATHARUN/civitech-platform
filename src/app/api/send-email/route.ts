import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'nagatharunnv@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function POST(request: NextRequest) {
    try {
        const { type, email, schemeName, status } = await request.json();

        if (type === 'registration') {
            await sendRegistrationEmail(email);
        } else if (type === 'status-update') {
            await sendStatusUpdateEmail(email, schemeName, status);
        } else {
            return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[EMAIL API] Error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}

async function sendRegistrationEmail(email: string) {
    const mailOptions = {
        from: `"CiviTech Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🎉 Welcome to CiviTech - Your Account is Ready!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to CiviTech! 🎉</h1>
                </div>
                <div style="background: white; padding: 30px; border-radius: 12px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: #0f172a; margin-top: 0;">Your Citizen Account is Active</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Congratulations! Your CiviTech account has been successfully created. You now have access to:
                    </p>
                    <ul style="color: #475569; font-size: 16px; line-height: 1.8;">
                        <li>✅ Personalized welfare scheme recommendations</li>
                        <li>✅ Real-time application tracking</li>
                        <li>✅ AI-powered eligibility assessment</li>
                        <li>✅ Multi-language support</li>
                    </ul>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/profile" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                            Explore Your Dashboard →
                        </a>
                    </div>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Registration email sent to: ${email}`);
}

async function sendStatusUpdateEmail(email: string, schemeName: string, status: string) {
    const statusEmoji = status === 'applied' ? '🚀' : '📌';
    const statusColor = status === 'applied' ? '#10b981' : '#3b82f6';
    const statusText = status === 'applied' ? 'APPLIED' : 'SAVED';

    const mailOptions = {
        from: `"CiviTech Tracker" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `${statusEmoji} Tracking Update: ${schemeName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="font-size: 48px;">${statusEmoji}</span>
                    </div>
                    <h2 style="color: #0f172a; text-align: center;">Status Update</h2>
                    <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="color: #475569; margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">SCHEME</p>
                        <p style="color: #0f172a; margin: 0 0 20px 0; font-size: 18px; font-weight: bold;">${schemeName}</p>
                        <p style="color: #475569; margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">NEW STATUS</p>
                        <span style="background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
                            ${statusText}
                        </span>
                    </div>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Status update email sent to: ${email}`);
}
