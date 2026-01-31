"use server";

export async function sendContactEmailAction(formData: FormData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");
    const honeypot = formData.get("website");

    // Honeypot check: If filled, it's a bot. Return success to fool them.
    if (honeypot) {
        return { success: true };
    }

    // console.log("Contact Form Submission:", { name, email, subject, message });

    // Implementation logic for email (using mock or process.env variables)
    // To actually send to Gmail, user needs:
    // GMAIL_USER=your@gmail.com
    // GMAIL_PASS=your-app-password

    // In a real scenario we'd use nodemailer:
    /*
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    */

    return { success: true };
}
