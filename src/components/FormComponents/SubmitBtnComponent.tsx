import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader } from "../Layout";

interface ISubmitBtnComponentProps {
  value: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  isPending?: boolean;
  alignment?: "vertical" | "horizontal";
  className?: string;
}

function SubmitBtnComponent({
  value = "Send",
  disabled,
  isSubmitting,
  isPending,
  className,
}: ISubmitBtnComponentProps) {
  return (
    <Button
      disabled={disabled}
      className={cn(
        "w-full h-12",
        className
      )}
      type="submit"
    >
      <span>
        {isSubmitting || isPending ? <Loader className="h-8" /> : value}
      </span>
    </Button>
  );
}

export default SubmitBtnComponent;
