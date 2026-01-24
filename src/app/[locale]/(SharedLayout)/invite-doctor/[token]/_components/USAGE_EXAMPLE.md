# How to Use the Invite Token in Another Function

## Example 1: Using the token in a registration form

```tsx
"use client";

import { processInviteToken, acceptInviteWithData } from "./invite-doctor-utils";
import { useSearchParams } from "next/navigation";

export default function DoctorRegistrationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const handleRegistration = async (formData: any) => {
    if (token) {
      // First validate the token
      const validation = await processInviteToken(token, locale);
      
      if (validation.success) {
        // Then accept the invite with registration data
        const result = await acceptInviteWithData(token, formData, locale);
        
        if (result.success) {
          console.log("Registration completed with invite token:", token);
        }
      }
    }
  };
  
  // ... rest of your form
}
```

## Example 2: Using the token in an API route

```typescript
// app/api/doctors/register/route.ts
import { processInviteToken } from "@/app/[locale]/(SharedLayout)/invite-doctor/[token]/_components/invite-doctor-utils";

export async function POST(request: Request) {
  const { token, formData, locale } = await request.json();
  
  // Validate token first
  const tokenValidation = await processInviteToken(token, locale);
  
  if (!tokenValidation.success) {
    return Response.json({ error: "Invalid token" }, { status: 400 });
  }
  
  // Use the token in your registration logic
  // ... your registration code here
  
  return Response.json({ success: true, token });
}
```

## Example 3: Extracting token from URL

```typescript
import { extractTokenFromUrl } from "./invite-doctor-utils";

// From a full URL
const url = "https://yoursite.com/en/invite-doctor/i0AlT46SIjGZBOM6q1PjcbU15jfJ8WwnLCcMXJ0w7hcKwtVKUB0GClBzF4dZt3H6";
const token = extractTokenFromUrl(url);
// Returns: "i0AlT46SIjGZBOM6q1PjcbU15jfJ8WwnLCcMXJ0w7hcKwtVKUB0GClBzF4dZt3H6"

// From a relative path
const relativePath = "/en/invite-doctor/i0AlT46SIjGZBOM6q1PjcbU15jfJ8WwnLCcMXJ0w7hcKwtVKUB0GClBzF4dZt3H6";
const token2 = extractTokenFromUrl(relativePath);
// Returns: "i0AlT46SIjGZBOM6q1PjcbU15jfJ8WwnLCcMXJ0w7hcKwtVKUB0GClBzF4dZt3H6"
```

## Example 4: Using token in a server component

```tsx
// app/[locale]/(SharedLayout)/doctors-apply/page.tsx
import { processInviteToken } from "../invite-doctor/[token]/_components/invite-doctor-utils";

export default async function DoctorsApplyPage({ 
  params: { locale },
  searchParams 
}: { 
  params: { locale: string };
  searchParams: { token?: string };
}) {
  let inviteData = null;
  
  if (searchParams.token) {
    const result = await processInviteToken(searchParams.token, locale);
    if (result.success) {
      inviteData = result.data;
    }
  }
  
  return (
    <div>
      {inviteData && (
        <p>Welcome! You were invited with token: {searchParams.token}</p>
      )}
      {/* Your registration form */}
    </div>
  );
}
```

## Available Functions

1. **`processInviteToken(token, locale)`** - Validates and processes the invite token
2. **`acceptInviteWithData(token, formData, locale)`** - Accepts the invite with additional registration data
3. **`extractTokenFromUrl(url)`** - Extracts the token from any URL format
