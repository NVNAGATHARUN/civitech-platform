/**
 * Client-side Email Service
 * Calls the server-side API route to send emails
 */

export const EmailService = {
    /**
     * Sends a welcome email to a newly registered user
     */
    async sendRegistrationEmail(email: string): Promise<boolean> {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'registration', email }),
            });

            if (response.ok) {
                console.log(`%c[EMAIL SERVICE] ✅ Registration email sent to: ${email}`, "color: #10b981; font-weight: bold;");
                return true;
            } else {
                console.error('[EMAIL SERVICE] ❌ Failed to send registration email');
                return false;
            }
        } catch (error) {
            console.error('[EMAIL SERVICE] ❌ Error:', error);
            return false;
        }
    },

    /**
     * Sends a notification when a scheme status is updated in the tracker
     */
    async sendStatusUpdateEmail(email: string, schemeName: string, status: string): Promise<boolean> {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'status-update', email, schemeName, status }),
            });

            if (response.ok) {
                console.log(`%c[EMAIL SERVICE] ✅ Status update email sent to: ${email}`, "color: #3b82f6; font-weight: bold;");
                return true;
            } else {
                console.error('[EMAIL SERVICE] ❌ Failed to send status update email');
                return false;
            }
        } catch (error) {
            console.error('[EMAIL SERVICE] ❌ Error:', error);
            return false;
        }
    }
};
