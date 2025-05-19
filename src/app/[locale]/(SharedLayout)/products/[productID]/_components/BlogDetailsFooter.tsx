import { IBlog } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopyToClipboard } from "@/components/sub";
import { Button } from "@/components/ui/button";
import { FaXTwitter, FaFacebook, FaLinkedin } from "react-icons/fa6";
import { cn } from "@/lib/utils";

function BlogDetailsFooter({
  blog,
  className,
}: {
  blog: IBlog;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-8 md:flex-row  md:justify-between md:items-center",
        className
      )}
    >
      <div className="flex items-center justify-start gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={blog.avatar} alt={blog?.publisher?.name} />
          <AvatarFallback>{blog?.publisher?.name}</AvatarFallback>
        </Avatar>
        <div>
          <h5 className="text-sm font-semibold leading-tight text-text-primary-900">
            {blog?.publisher?.name}
          </h5>
          <h6 className="text-sm font-normal leading-tight  text-text-tertiary-600">
            Product Designer, ADVIX
          </h6>
        </div>
      </div>
      <div className="flex gap-3">
        <CopyToClipboard value={`${process.env.NEXT_PUBLIC_APP_URL!}/blog/${blog?.id}`} />
        <Button
          //onClick={handleCopy}
          variant={"secondary"}
          size={"icon"}
          className=" shrink-0 text-foreground-quinary-400"
        >
          <FaXTwitter className="w-5 h-5 " />
        </Button>
        <Button
          //onClick={handleCopy}
          variant={"secondary"}
          size={"icon"}
          className=" shrink-0 text-foreground-quinary-400"
        >
          <FaFacebook className="w-5 h-5 " />
        </Button>
        <Button
          //onClick={handleCopy}
          variant={"secondary"}
          size={"icon"}
          className=" shrink-0 text-foreground-quinary-400"
        >
          <FaLinkedin className="w-5 h-5 " />
        </Button>
      </div>
    </div>
  );
}

export default BlogDetailsFooter;
