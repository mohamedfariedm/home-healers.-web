import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { IFormElementProps } from "@/types";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { getI18n } from "react-i18next";
import FieldError from "./FieldError";

function CustomTextArea({
  name,
  label = "",
  placeholder,
  required = true,
  ServerErrors,
  inputStyle,
  disabled = false,
  className,
  rows = 5,
  type = "text",
}: IFormElementProps) {
  const {
    register,
    formState: { errors, dirtyFields },
  } = useFormContext();
  const error =
    ServerErrors?.response?.data?.errors?.[name]?.[0] ||
    (errors?.[name]?.message as string);
  const locale = getI18n().language;
  return (
    <div
      className={cn(
        `w-full flex flex-col items-start gap-1.5 bg -red-300`,
        label ? "min-h-[94px]" : "min-h-[64px]",
        className
      )}
    >
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            `text-sm text-secondary-700 font-medium flex items-center gap-0.5 whitespace-nowrap  trns `,
            error && " text-error "
          )}
        >
          {label}{" "}
          <span
            className={cn(
              "opacity-0",
              required
                ? "text-[#2318fb] dark:text-[#94969C]"
                : "font-medium text-disabled "
            )}
          >
            {required ? "*" : locale === "en" ? "(Optional)" : "(اختياري)"}
          </span>
        </Label>
      )}
      <Textarea
        disabled={disabled}
        rows={rows}
        className={cn(
          `w-full   px-3.5   rounded-lg text-base placeholder:text-placeholder  font-light`,
          error &&
            "focus-visible:ring-error ring-1 ring-error  text-error focus:text-error placeholder:text-error focus:placeholder:text-error",
          inputStyle
        )}
        id={name}
        placeholder={placeholder}
        {...register(`${name}`)}
      />

      <FieldError error={error} />
    </div>
  );
}

export default CustomTextArea;
