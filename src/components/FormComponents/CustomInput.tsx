"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { IFormElementProps } from "@/types";
import FieldError from "./FieldError";
import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

import { getI18n } from "react-i18next";

function CustomInput({
  name,
  label = "",
  placeholder,
  required = true,
  ServerErrors,
  inputStyle,
  disabled = false,
  className,
  type = "text",
}: IFormElementProps) {
  const {
    register,
    formState: { errors, dirtyFields },
  } = useFormContext();
  const [hide, setHide] = useState(false);
  const error =
    ServerErrors?.response?.data?.errors?.[name]?.[0] ||
    (errors?.[name]?.message as string);
  const locale = getI18n().language;
  return (
    <div
      className={cn(
        `w-full flex flex-col items-start gap-1.5 bg- red-300`,
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
      <div className="w-full relative">
        <Input
          disabled={disabled}
          className={cn(
            `w-full  h-11 px-3.5 rounded-lg text-base placeholder:text-placeholder font-light  `,
            error &&
              " focus-visible:ring-error ring-1 ring-error  text-error focus:text-error placeholder:text-error focus:placeholder:text-error ",
            inputStyle
          )}
          type={type === "password" ? (hide ? "text" : "password") : "text"}
          inputMode={type === "number" ? "numeric" : "text"}
          id={name}
          placeholder={placeholder}
          autoComplete="off"
          {...register(`${name}`)}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setHide(!hide)}
            className={cn(
              `absolute right-3 rtl:right-auto rtl:left-3 -translate-y-1/2 top-1/2 h-4 w-4 cursor-pointer `,
              error && " text-error "
            )}
          >
            {hide ? <LuEyeOff /> : <LuEye />}
          </button>
        )}
      </div>
      <FieldError error={error} />
    </div>
  );
}

export default CustomInput;
