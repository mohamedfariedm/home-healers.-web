import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IFormElementProps } from "@/types";
import { Controller, useFormContext } from "react-hook-form";
import FieldError from "./FieldError";

interface CustomCheckboxProps extends IFormElementProps {
  checkboxLabel: string | JSX.Element;
  checkboxLink?: string | JSX.Element;
}

export function CustomCheckbox({
  name,
  label = "",
  checkboxLabel,
  checkboxLink,
  required = true,
  ServerErrors,
  disabled = false,
  className,
}: CustomCheckboxProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error =
    ServerErrors?.response?.data?.errors?.[name]?.[0] ||
    (errors?.[name]?.message as string);

  return (
    <div
      className={cn(
        `w-full flex flex-col items-start gap-1.5 bg -red-300`,
        label ? "min-h- [94px]" : "min-h- [64px]",
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
          {required && (
            <span className="text-[#2318fb] dark:text-[#94969C] opacity-0">
              *
            </span>
          )}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-1 text-sm  text-text-tertiary-600">
            <div className="flex gap-2 items-center  ">
              <Checkbox
                id={name}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
              <Label
                className="  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer "
                htmlFor={name}
              >
                {checkboxLabel}
              </Label>
            </div>
            {checkboxLink && <div className="mb-1">{checkboxLink}</div>}
          </div>
        )}
      />
      <FieldError error={error} />
    </div>
  );
}

export default CustomCheckbox;
