"use client";

import Image, { type ImageProps } from "next/image";

const FALLBACK = "/assets/images/doctorMale.webp";

function isSvg(src: string) {
  return /\.svg(\?|$)/i.test(src);
}

/**
 * next/image wrapper that keeps the same visual but avoids optimizing SVGs
 * (Next image optimizer rejects SVG and can stall the main thread).
 */
export default function OptimizedMedia({
  src,
  alt,
  ...rest
}: ImageProps) {
  const resolved =
    typeof src === "string" && src
      ? src
      : FALLBACK;

  if (typeof resolved === "string" && isSvg(resolved)) {
    const {
      fill,
      width,
      height,
      className,
      sizes: _sizes,
      quality: _quality,
      priority: _priority,
      loading,
      ...imgRest
    } = rest as ImageProps & { loading?: "lazy" | "eager" };

    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt={alt || ""}
          className={className}
          loading={loading || "lazy"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          {...(imgRest as React.ImgHTMLAttributes<HTMLImageElement>)}
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt || ""}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        className={className}
        loading={loading || "lazy"}
        {...(imgRest as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  }

  return <Image src={resolved} alt={alt} {...rest} />;
}
