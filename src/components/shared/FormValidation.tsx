import { z } from "zod";

const PHONE = /^\+\d{8,15}$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export const cleanPhone = (v: string) => v.replace(/[\s()-]/g, "");

export const withProtocol = (v: string) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v);

export const requiredText = (label: string, max = 500, min = 2) =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .min(2, { message: `${label} is required` })
    .min(min, { message: `${label} must be at least ${min} characters` })
    .max(max, { message: `${label} must be ${max} characters or less` });

export const optionalText = (label: string, max = 1000) =>
  z
    .string()
    .trim()
    .max(max, { message: `${label} must be ${max} characters or less` })
    .optional()
    .default("");

export const email = (label = "Email") =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .toLowerCase()
    .min(2, { message: `${label} is required` })
    .max(160, { message: `${label} is too long` })
    .email({ message: "Enter a valid email" });

export const optionalEmail = (label = "Email") =>
  z
    .string()
    .trim()
    .toLowerCase()
    .max(160, { message: `${label} is too long` })
    .refine((v) => v === "" || z.string().email().safeParse(v).success, { message: "Enter a valid email" })
    .optional()
    .default("");

export const phone = (label = "Phone number") =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .min(1, { message: `${label} is required` })
    .transform(cleanPhone)
    .refine((v) => PHONE.test(v), { message: `${label} must start with + and the country code` });

export const optionalPhone = (label = "Phone number") =>
  z
    .string()
    .trim()
    .transform(cleanPhone)
    .refine((v) => v === "" || PHONE.test(v), { message: `${label} must start with + and the country code, e.g. +250788123456` })
    .optional()
    .default("");

export const optionalUrl = (label = "Link") =>
  z
    .string()
    .trim()
    .transform(withProtocol)
    .refine((v) => v === "" || z.string().url().safeParse(v).success, { message: `${label} must be a valid link` })
    .optional()
    .default("");

export const amount = (label = "Amount", { min = 0, max = 999_999_999_999 } = {}) =>
  z
    .union([z.number(), z.string()])
    .transform((v) => (typeof v === "string" ? Number(v.replace(/,/g, "").trim()) : v))
    .refine((v) => Number.isFinite(v), { message: `${label} must be a number` })
    .refine((v) => v >= min, { message: `${label} must be at least ${min}` })
    .refine((v) => v <= max, { message: `${label} is too large` })
    .refine((v) => Math.round(v * 100) === v * 100, { message: `${label} can have at most 2 decimals` });

export const currency = () =>
  z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, { message: "Choose a currency" });

export const uuid = (label = "Item") => z.string().uuid({ message: `Choose a ${label.toLowerCase()}` });
export const optionalUuid = () =>
  z
    .string()
    .optional()
    .nullable()
    .transform((v) => v || null)
    .refine((v) => v === null || z.string().uuid().safeParse(v).success, { message: "Invalid choice" });

export const day = (label = "Date") => z.string().regex(DAY, { message: `${label} is not a valid date` });
export const optionalDay = (label = "Date") =>
  z
    .string()
    .optional()
    .default("")
    .refine((v) => v === "" || DAY.test(v), { message: `${label} is not a valid date` });

export const tags = (max = 20, maxLength = 100) =>
  z
    .array(z.string())
    .default([])
    .transform((list) => {
      const seen = new Set<string>();
      return list
        .map((t) => t.trim().replace(/\s+/g, " "))
        .filter((t) => t && !seen.has(t.toLowerCase()) && !!seen.add(t.toLowerCase()));
    })
    .refine((list) => list.length <= max, { message: `At most ${max} tags` })
    .refine((list) => list.every((t) => t.length <= maxLength), { message: `Each tag must be ${maxLength} characters or less` });

//  Form schemas 

export const USER_ROLES = ["dev", "admin", "hr", "finance", "staff", "user"] as const;

export const userSchema = z.object({
  firstName: requiredText("First name", 75),
  lastName: requiredText("Last name", 75),
  email: email(),
  phone: phone(),
  role: z.enum(USER_ROLES, { message: "Choose a role" }),
  status: z.enum(["active", "deactivated"]).default("active"),
});

export const serviceSchema = z.object({
  name: requiredText("Name", 120),
  description: requiredText("Description", 500),
  tags: tags(),
  isActive: z.boolean().default(true),
});

export const serviceFeeSchema = z.object({
  name: requiredText("Fee name", 200),
  serviceId: optionalUuid(),
  amount: amount("Amount"),
  currency: currency(),
  description: optionalText("Description", 500),
  isActive: z.boolean().default(true),
});

export const faqSchema = z.object({
  question: requiredText("Question", 260, 5),
  answer: requiredText("Answer", 1000, 2),
  isPublished: z.boolean().default(true),
});

export const companySchema = z.object({
  name: requiredText("Company name", 250),
  about: optionalText("About", 500),
  email: email("Email"),
  phone: optionalPhone("Phone number"),
  whatsapp: phone("WhatsApp number"),
  website: optionalUrl("Website"),
  linkedin: optionalText("LinkedIn", 200),
  address: optionalText("Address", 200),
  city: optionalText("City", 100),
  country: optionalText("Country", 100),
});

// Quotation 

// Today's date in Kigali as YYYY-MM-DD
const todayKigali = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Kigali" }).format(new Date());

// One extra line (line 1, the support fee)
export const quotationLineSchema = z.object({
  description: requiredText("Description", 200),
  quantity: amount("Quantity", { min: 0.01, max: 100_000 }),
  unitPrice: amount("Unit price").refine((v) => v > 0, { message: "Enter a price" }),
});

export const quotationSchema = z.object({
  items: z.array(quotationLineSchema).max(49, { message: "A quotation can have at most 50 lines" }),
  validUntil: optionalDay("Valid until").refine((v) => v === "" || v >= todayKigali(), { message: "Valid until can't be in the past" }),
  note: optionalText("Note", 1000),
});

// Public request form (customer)
export const requestSchema = z.object({
  firstName: requiredText("First name", 120),
  lastName: requiredText("Last name", 120),
  email: email(),
  phone: phone("WhatsApp / phone number"),
  serviceId: uuid("Service"),
  country: optionalText("Country", 120),
  timezone: optionalText("Time zone", 100),
  description: requiredText("Description", 2000, 5),
});

export const successStorySchema = z.object({
  customerName: requiredText("Customer name", 220),
  country: optionalText("Country", 100),
  service: optionalText("Service", 220),
  title: requiredText("Title", 220),
  story: requiredText("Story", 1500, 20),
  rating: z.coerce.number().int().min(1).max(5).nullable().default(null),
  storyDate: optionalDay("Date"),
  photoUrl: optionalText("Photo", 500),
  consent: z.literal(true, { message: "Confirm the customer agreed to share their story" }),
  isPublished: z.boolean().default(true),
});

export const dateRangeSchema = z
  .object({ from: optionalDay("From"), to: optionalDay("To") })
  .refine((v) => !v.from || !v.to || v.from <= v.to, { message: "'From' must be before 'To'", path: ["from"] });


// Sign in & passwords 
const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "12345678", "123456789", "1234567890", "qwerty123", "11111111",
  "iloveyou", "admin123", "welcome1", "letmein1", "abc12345", "passw0rd", "rwanda123", "kigali123", "changeme1",
]);

// A NEW password
export const newPassword = (label = "Password") =>
  z
    .string({ message: `${label} is required` })
    .min(1, { message: `${label} is required` })
    .min(8, { message: `${label} must have at least 8 characters` })
    .max(128, { message: `${label} must be 128 characters or less` })
    .refine((v) => /[a-zA-Z]/.test(v) && /\d/.test(v), { message: `${label} must have at least one letter and one number` })
    .refine((v) => !COMMON_PASSWORDS.has(v.toLowerCase()), { message: "This password is too common. Choose another one" });

// Sign in
export const loginSchema = z.object({
  email: email(),
  password: z.string().min(1, { message: "Password is required" }).max(128, { message: "Password is too long" }),
  rememberMe: z.boolean().default(false),
});

export const forgotPasswordSchema = z.object({ email: email() });

// Invitation / reset link
export const setPasswordSchema = z
  .object({
    password: newPassword(),
    confirmPassword: z.string().min(1, { message: "Confirm your password" }),
  })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

// Signed-in user changes their own password
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: newPassword("New password"),
    confirmPassword: z.string().min(1, { message: "Confirm the new password" }),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] })
  .refine((v) => v.newPassword !== v.currentPassword, { message: "Choose a password different from the current one", path: ["newPassword"] });

// Admin / dev sets someone else's password
export const adminPasswordSchema = z
  .object({
    password: newPassword(),
    confirmPassword: z.string().min(1, { message: "Confirm the password" }),
    notifyUser: z.boolean().default(true),
  })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

// 0..4 for the strength bar (just a guide; the rules above decide)
export const passwordStrength = (password: string) => {
  const p = password ?? "";
  if (!p) return { score: 0, label: "" };
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/\d/.test(p) && /[^a-zA-Z0-9]/.test(p)) score++;
  if (p.length < 8 || !/[a-zA-Z]/.test(p) || !/\d/.test(p) || COMMON_PASSWORDS.has(p.toLowerCase())) score = Math.min(score, 1);
  return { score, label: ["Too weak", "Weak", "Fair", "Good", "Strong"][score] };
};


// Helpers 

export type FieldErrors = Record<string, string>;

export const fieldErrors = (error: z.ZodError): FieldErrors => {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
};

// One call for forms
export const validate = <S extends z.ZodTypeAny>(
  schema: S,
  values: unknown,
): { ok: true; data: z.output<S>; errors: FieldErrors } | { ok: false; data: null; errors: FieldErrors } => {
  const result = schema.safeParse(values);
  return result.success
    ? { ok: true, data: result.data, errors: {} }
    : { ok: false, data: null, errors: fieldErrors(result.error) };
};

// First error as one sentence (for a toast)
export const firstError = (errors: FieldErrors) => Object.values(errors)[0] ?? "";

// "" -> null for optional fields before sending to the API
export const emptyToNull = <T extends Record<string, any>>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === "" ? null : v])) as T;


