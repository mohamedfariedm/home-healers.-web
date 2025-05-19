import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IFormElementProps } from "@/types";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FieldError from "./FieldError";

function CustomSelect({
  name,
  label = "",
  placeholder,
  required = true,
  ServerErrors,
  disabled = false,
  className,
  options,
}: IFormElementProps) {
  const {
    control,
    formState: { errors, dirtyFields },
  } = useFormContext();
  const error =
    ServerErrors?.response?.data?.errors?.[name]?.[0] ||
    (errors?.[name]?.message as string);
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
          {required && (
            <span className="text-[#2318fb] dark:text-[#94969C] opacity-0">
              *
            </span>
          )}
        </Label>
      )}{" "}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "",
                error &&
                  " focus-visible:ring-error focus:ring-error ring-1 ring-error  text-error focus:text-error placeholder:text-error focus:placeholder:text-error ",
                field.value?"":"text-placeholder"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <FieldError error={error} />
    </div>
  );
}

export default CustomSelect;
