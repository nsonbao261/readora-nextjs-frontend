// Password policy: 8+ characters with at least one letter and one number.
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// VN mobile number: exactly 10 digits starting with "0".
export const PHONE_REGEX = /^0\d{9}$/;

// Registration age bounds (years) applied to the date-of-birth field.
export const MIN_AGE = 18;
export const MAX_AGE = 120;

// Demo code shown on the verification step so the flow is demonstrable.
export const DEMO_VERIFICATION_CODE = "123456";

// Seconds to wait before a verification/reset code can be resent.
export const RESEND_COOLDOWN_SECONDS = 30;

// Where customers land after auth when no redirect param is given.
export const DEFAULT_REDIRECT = "/";

// Seeded demo admin account (redirected to /admin on login).
export const DEMO_ADMIN_EMAIL = "admin@readora.com";
export const DEMO_ADMIN_PASSWORD = "admin123";

// Seeded demo customer account (redirected to / or the redirect param).
export const DEMO_CUSTOMER_EMAIL = "customer@readora.com";
export const DEMO_CUSTOMER_PASSWORD = "customer123";

// Seeded unverified customer account (demonstrates the verifyEmail flow).
export const DEMO_UNVERIFIED_EMAIL = "unverified@readora.com";
export const DEMO_UNVERIFIED_PASSWORD = "unverified123";

// Demo Google account used by the simulated "Continue with Google" login.
export const DEMO_GOOGLE_EMAIL = "demo.google@gmail.com";
