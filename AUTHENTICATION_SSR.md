# Server-Side Authentication Implementation

## Overview

This document describes the SSR (Server-Side Rendering) authentication implementation for Next Models Nepal. The authentication flow has been migrated from client-side checking to server-side verification for improved security and user experience.

## Architecture

### Backend (Express)

**Authentication Endpoint: `/api/auth/verify`**

-   Validates JWT token from httpOnly cookie
-   Returns user data if valid
-   Returns 401 if token is missing, invalid, or expired
-   Verifies admin still exists in database

**Login Flow:**

1. User submits credentials → `/api/auth/login`
2. Backend validates credentials
3. Sets two cookies:
    - `token` (httpOnly=true) → Primary auth token for backend + SSR
    - `session` (httpOnly=false) → Optional, for client-side UI state

### Frontend (Next.js 15)

**Server-Side Auth Utility: `lib/auth-server.ts`**

```typescript
verifyServerAuth(): Promise<AuthUser>
```

-   Runs in Server Components
-   Reads httpOnly `token` cookie
-   Calls backend `/api/auth/verify`
-   Redirects to `/login` if not authenticated
-   Returns user data if authenticated

```typescript
isAuthenticated(): Promise<boolean>
```

-   Checks if user has valid token
-   Used in login page to redirect already-authenticated users

## Implementation Details

### Admin Layout (`app/admin/layout.tsx`)

**Before (Client-Side):**

```tsx
"use client";
export default function AdminLayout({ children }) {
    return (
        <ProtectedRoute>
            {/* Shows loading spinner on every page load */}
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </ProtectedRoute>
    );
}
```

**After (Server-Side):**

```tsx
// Server Component (async)
export default async function AdminLayout({ children }) {
    await verifyServerAuth(); // Instant redirect, no loading state
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
```

### Login Page (`app/login/page.tsx`)

**Before (Client-Side):**

```tsx
"use client";
export default function LoginPage() {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (user && !loading) {
            router.push("/admin/dashboard");
        }
    }, [user, loading]);

    if (loading) return <LoadingSpinner />;
    return <LoginForm />;
}
```

**After (Server-Side):**

```tsx
// Server Component (async)
export default async function LoginPage() {
    const authenticated = await isAuthenticated();
    if (authenticated) redirect("/admin/dashboard");

    return <LoginPageClient />;
}
```

### Client Components

**AdminLayoutClient** (`components/admin/layout/AdminLayoutClient.tsx`)

-   Handles interactive UI: sidebar toggle, mobile menu, hover states
-   No auth logic, purely UI state management

**LoginPageClient** (`app/login/LoginPageClient.tsx`)

-   Form handling and submission
-   Error display
-   Calls `auth.refreshAuth()` after successful login to update client context

### Auth Context (Still Used)

**Purpose:** Client-side UI state only

-   User email/role display in header/sidebar
-   Logout functionality
-   **Not used for route protection anymore**

## Security Improvements

### Before (Client-Side)

❌ `session` cookie was client-accessible → Could be manipulated
❌ Auth check on mount → Flash of loading state
❌ Client-side redirect → Delayed protection
❌ Could potentially access protected routes before redirect

### After (Server-Side)

✅ `token` cookie is httpOnly → Cannot be accessed/manipulated by JS
✅ Auth check before render → No loading state
✅ Server-side redirect → Instant protection
✅ Routes protected before any content is sent to client
✅ JWT validation with database check

## Benefits

### 1. **No Loading Spinner**

-   Server Components verify auth before rendering
-   User never sees "Checking authentication..." state
-   Instant redirects

### 2. **Better Security**

-   httpOnly cookie prevents XSS attacks
-   JWT validated server-side with database check
-   Routes protected at server level (can't be bypassed)

### 3. **Improved UX**

-   No flash of loading states
-   Faster perceived performance
-   Cleaner, more predictable behavior

### 4. **Cleaner Code**

-   Auth logic separated from UI components
-   Server Components for data/auth
-   Client Components for interactivity
-   Clear separation of concerns

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── auth.controller.ts          # verify() endpoint added
│   ├── routes/
│   │   └── auth.route.ts               # GET /verify route
│   └── middleware/
│       └── auth.middleware.ts          # verifyAdminToken (unchanged)

frontend/
├── src/
│   ├── lib/
│   │   └── auth-server.ts              # NEW: SSR auth utilities
│   ├── app/
│   │   ├── admin/
│   │   │   └── layout.tsx              # Server Component with verifyServerAuth()
│   │   └── login/
│   │       ├── page.tsx                # Server Component with isAuthenticated()
│   │       └── LoginPageClient.tsx     # NEW: Client form component
│   ├── components/
│   │   ├── admin/layout/
│   │   │   └── AdminLayoutClient.tsx   # NEW: Interactive layout wrapper
│   │   └── ProtectedRoute.tsx          # DEPRECATED (no longer used)
│   ├── context/
│   │   └── authContext.tsx             # Still used for client UI state
│   └── hooks/
│       └── useAuth.ts                  # Still used for logout/UI
```

## Testing

### Test Cases

1. **Unauthenticated Access:**

    - Visit `/admin/*` without token → Instant redirect to `/login`
    - No loading spinner shown

2. **Authenticated Access:**

    - Login successfully → Redirected to `/admin/dashboard`
    - Visit `/login` while authenticated → Redirected to `/admin/dashboard`
    - Refresh any admin page → No loading state, instant access

3. **Token Expiration:**

    - Access admin page with expired token → Redirect to `/login`
    - Backend returns 401 → SSR auth utility catches and redirects

4. **Logout:**
    - Click logout → Clears both cookies
    - Redirects to `/login`
    - Cannot access admin pages after logout

## Future Improvements

1. **Optional:** Remove `session` cookie entirely

    - Fetch user data server-side when needed
    - Pass as props to client components
    - Eliminates client-accessible auth data

2. **Optional:** Add middleware.ts

    - Edge runtime for even faster redirects
    - Check cookie existence before Server Component runs
    - Trade-off: Can't verify JWT without API call

3. **Optional:** Add auth caching
    - Cache verified tokens for short duration (30s-1min)
    - Reduce backend calls on rapid page navigation
    - Balance: security vs performance
