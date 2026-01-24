import ClientAPI from "@/app/api/api";

/**
 * Utility function to process invite token
 * This function can be used anywhere in your application
 */
export async function processInviteToken(
    token: string,
    locale: string
): Promise<{
    success: boolean;
    data?: any;
    message?: string;
}> {
    try {
        const response = await ClientAPI.validateInviteToken(token, locale);

        if (response?.success || response?.data) {
            return {
                success: true,
                data: response.data,
                message: response?.message || "Token validated successfully",
            };
        }

        return {
            success: false,
            message: response?.message || "Invalid token",
        };
    } catch (error: any) {
        console.error("Error processing invite token:", error);
        return {
            success: false,
            message: error?.message || "Failed to process token",
        };
    }
}

/**
 * Utility function to accept invite token with additional data
 * Use this when the user completes registration with the invite token
 */
export async function acceptInviteWithData(
    token: string,
    formData: any,
    locale: string
): Promise<{
    success: boolean;
    data?: any;
    message?: string;
}> {
    try {
        const response = await ClientAPI.acceptInviteToken(token, formData, locale);

        if (response?.success || response?.data) {
            return {
                success: true,
                data: response.data,
                message: response?.message || "Invitation accepted successfully",
            };
        }

        return {
            success: false,
            message: response?.message || "Failed to accept invitation",
        };
    } catch (error: any) {
        console.error("Error accepting invite:", error);
        return {
            success: false,
            message: error?.message || "Failed to accept invitation",
        };
    }
}

/**
 * Extract token from URL
 * Helper function to get token from various URL formats
 */
export function extractTokenFromUrl(url: string): string | null {
    try {
        // Handle full URLs
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/");
        const inviteIndex = pathParts.indexOf("invite-doctor");

        if (inviteIndex !== -1 && pathParts[inviteIndex + 1]) {
            return pathParts[inviteIndex + 1];
        }

        // Handle relative paths
        const relativeMatch = url.match(/invite-doctor\/([^\/\?]+)/);
        if (relativeMatch) {
            return relativeMatch[1];
        }

        return null;
    } catch {
        // If URL parsing fails, try regex
        const match = url.match(/invite-doctor\/([^\/\?]+)/);
        return match ? match[1] : null;
    }
}
