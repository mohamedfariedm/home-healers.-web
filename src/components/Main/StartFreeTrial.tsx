import { TFunction } from "i18next";
import { Container } from "../Layout";
import { cn } from "@/lib/utils";
import initTranslations from "@/app/i18n";
import Heading from "./Headings/Heading";
import SubHeading from "./Headings/SubHeading";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

async function StartFreeTrial({
  locale,
  withImage,
  className,
}: {
  locale: string;
  withImage?: boolean;
  className?: string;
}) {
  const { t } = await initTranslations(locale, ["common"]);

  return (
    <div
      className={cn(
        "w-full",
        className,
        withImage ? "" : "bg-background-secondary"
      )}
    >
      <Container
        className={cn(
          "",
          withImage
            ? "bg-background-secondary rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-9 min-h-[800px] lg:min-h-[400px]"
            : ""
        )}
      >
        <div
          className={cn(
            "",
            withImage
              ? "grow w-full lg:w-[55%] lg:min-h-full p-6 md:p-12 flex flex-col items-start justify-center bg -red-100"
              : "w-full flex flex-col lg:flex-row justify-between items-start gap-5 "
          )}
        >
          <div className={cn("w-full ", withImage ? "" : "lg:w-1/2")}>
            <Heading className="text-start">
              {t("StartFreeTrial.Heading")}
            </Heading>
            <SubHeading className="mt-5 mb-9 text-start">
              {t("StartFreeTrial.SubHeading")}
            </SubHeading>
          </div>
          <Button asChild className="h-12 w-full max-w-96 md:w-fit shrink-0 ">
            <Link target="_blank" href={process.env.NEXT_PUBLIC_APP_URL!}>
              {t("StartFreeTrial.cta")}
            </Link>
          </Button>
        </div>

        {withImage && (
          <div className="w-full h-[350px] lg:w-[45%] lg:h-[400px]  relative overflow-hidden shrink-0 self-end">
            <Image
              src="/assets/images/start-free-trial.png"
              alt="start free trial"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="rounded-tl-[10px] rtl:rounded-tl-[0px] rtl:rounded-tr-[10px] lg:mt-9 object-cover object-left"
            />
          </div>
        )}
      </Container>
    </div>
  );
}

export default StartFreeTrial;
