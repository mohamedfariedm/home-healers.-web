import { z } from "zod";
import { TFunction } from "i18next";

export const ContactUsSchema = (t: TFunction) => {
  return z.object({
    firstName: z
      .string()
      .min(1, { message: t("validations.firstName.required") }),
    lastName: z
      .string()
      .min(1, { message: t("validations.lastName.required") }),
    email: z
      .string()
      .min(1, { message: t("validations.email.required") })
      .email({ message: t("validations.email.pattern") }),
    subject: z.string().min(1, { message: t("validations.subject.required") }),
    message: z.string().min(1, { message: t("validations.message.required") }),
    PrivacyCheck: z
      .boolean()
      .optional()
      /* .refine((val) => val === undefined || val === true, {
        message: t("validations.privacyPolicy.required"),
      }), */
  });
};

// Generate form types from zod validation schema
export type ContactUsType = z.infer<ReturnType<typeof ContactUsSchema>>;
