import { IValueCard } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import AnimatedBackgroundBeams from "../Animations/AnimatedBackgroundBeams";

function ValueCard({
  value,
  className,
}: {
  value: IValueCard;
  className?: string;
}) {
  return (
    <Card className="w-full p-5 h-fit sm:max-h-[500px] sm:aspect-square rounded-2xl xl:min-h-[340px] 2xl:min-h-fit bg-background-secondary border-none ">
      <CardHeader className="mb-12 md:mb-16 w-12 h-12 flex-center rounded-[10px] shadow bg-Components-button-primary-bg text-Components-icons-valued-icon-dark-fg-brand border-2 border-border-skeuemorphic-gradient text-2xl">
        {value?.icon}
      </CardHeader>
      <div className="w-full backdrop-blur-sm">
        <CardTitle className="text-lg lg:text-xl leading-7 lg:leading-[30px]">
          {value?.heading}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          {value?.subheading}
        </CardDescription>
      </div>
    </Card>
  );
}

export default ValueCard;
