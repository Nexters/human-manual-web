import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

type AssetImageProps = {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
};

const AssetImage = ({ src, alt = "", className, style }: AssetImageProps) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn("bg-gray-01 flex items-center justify-center rounded-2xl", className)}
        style={style}
        aria-hidden
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-contain", className)}
      style={style}
      onError={() => setFailed(true)}
    />
  );
};

export default AssetImage;
