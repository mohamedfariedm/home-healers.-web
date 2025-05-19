import { PiCheckCircle } from "react-icons/pi";

export function SuccessIcon() {
  return (
    <div className="relative">
      {/* Outer ripple */}
      <div className="absolute inset-0 bg-green-500/10 rounded-full animate-[ping_2s_ease-in-out_infinite]" />

      {/* Middle ripple */}
      <div className="absolute inset-0 bg-green-500/15 rounded-full animate-[ping_2s_ease-in-out_infinite_0.3s]" />

      {/* Inner glow */}
      <div className="absolute inset-0 bg-green-500/30 rounded-full animate-pulse" />

      {/* Icon */}
      <PiCheckCircle className="relative w-5 h-5 text-foreground-success-primary animate-appear" />
    </div>
  );
}
export default SuccessIcon;
