import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="flex-col flex items-center justify-center"
        >
          <h2
            style={{ fontSize: "52px", fontWeight: "600" }}
            className="text-[52px] font-semibold"
          >
            OPS, There is No page like you want !
          </h2>
          <Image
            style={{ maxWidth: "600px" }}
            className="max-w-[500px] max-h-[500px]"
            src="/assets/images/404-img.png"
            alt="404-img"
            width={700}
            height={500}
          />
          {/*           <Link href="/">Return Home</Link>
           */}{" "}
        </div>
      </body>
    </html>
  );
}
