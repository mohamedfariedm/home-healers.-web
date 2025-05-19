"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ContactUsSchema, ContactUsType } from "./contact-us.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CustomCheckbox,
  CustomInput,
  CustomSelect,
  CustomTextArea,
  SubmitBtnComponent,
} from "@/components/FormComponents";
import SuccessIcon from "@/components/ui/SuccessIcon";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { sendContactMessage } from "@/app/api/apiClient/apiClient";




function ContactUsForm() {
  const { t } = useTranslation("contactUs");
  const subjectOptions = [
    { value: "sales", label: t("sales") },
    { value: "technical", label: t("technical") },
  ];
  const schema = ContactUsSchema(t);
  const methods = useForm<ContactUsType>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
      PrivacyCheck: false,
    },
  });

  const [isPending, setIsPending] = useState(false); // Track loading state

  // Handle form submission
  const onSubmit = async (data: ContactUsType) => {
    setIsPending(true); // Show loading state when submitting the form
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      subject: data.subject,
      message: data.message,
    };

    try {
      const response = await sendContactMessage(payload); // Use the apiClient function

      // Show success toast
      toast.custom((ts) => (
        <div className="bg-background-primary-alt border border-border-primary text-text-secondary-700 p-4 rounded-lg shadow-lg flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-4">
            <SuccessIcon />
            <span className="text-sm font-medium">{t("form.success_toast")}</span>
          </div>
          <button
            onClick={() => toast.dismiss(ts)}
            className="text-foreground-quinary-400 hover:text-text-primary-900 transition-colors"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
      ));

      // Reset form after success
      methods.reset();

      console.log("Form submission successful:", response);
    } catch (error) {
      // Handle error and show toast
      toast.error(t("form.form_submission_error"));
      console.error("Error submitting form:", error);
    } finally {
      setIsPending(false); // Hide loading state after form submission
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="w-full space-y-1 max-w-md mx-auto"
        method="post"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-full md:flex-row gap-1 md:gap-8 items-start">
          <CustomInput
            name="firstName"
            className="w-full md:w-1/2"
            label={t("form.firstName.label")}
            placeholder={t("form.firstName.placeholder")}
          />
          <CustomInput
            name="lastName"
            className="w-full md:w-1/2"
            label={t("form.lastName.label")}
            placeholder={t("form.lastName.placeholder")}
          />
        </div>
        <CustomInput
          name="email"
          className="w-full"
          label={t("form.email.label")}
          placeholder={t("form.email.placeholder")}
        />
        <CustomSelect
          name="subject"
          className="w-full"
          label={t("form.subject.label")}
          placeholder={t("form.subject.placeholder")}
          options={subjectOptions}
        />
        <CustomTextArea
          type="message"
          name="message"
          className="w-full"
          label={t("form.message.label")}
          placeholder={t("form.message.placeholder")}
        />
        {/* <CustomCheckbox
          name="PrivacyCheck"
          className="w-full"
          checkboxLabel={t("form.PrivacyCheck.checkboxLabel")}
        /> */}

        <SubmitBtnComponent
          disabled={isPending}
          isPending={isPending}
          value={t("form.SubmitBtnComponent.value")}
          className="mt-0"
        />
      </form>
    </FormProvider>
  );
}

export default ContactUsForm;
