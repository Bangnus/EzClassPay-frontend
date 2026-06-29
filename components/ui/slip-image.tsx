"use client";

import React, { useState, useEffect } from "react";

interface SlipImageProps {
  url: string | null;
  className?: string;
  alt?: string;
}

export default function SlipImage({
  url,
  className = "w-full rounded-lg object-contain",
  alt = "สลิป",
}: SlipImageProps) {
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    if (!url) return;

    let finalUrl = url;
    if (url.includes("localhost")) {
      try {
        const parsed = new URL(url);
        finalUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}${parsed.pathname}`;
      } catch {}
    } else if (url.startsWith("/")) {
      finalUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}${url}`;
    } else if (!url.startsWith("http")) {
      finalUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/files/${url}`;
    }

    const isNgrok = finalUrl.includes("ngrok");
    const isDev = process.env.NODE_ENV === "development";

    if (isNgrok || isDev) {
      fetch(finalUrl, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          setImgSrc(URL.createObjectURL(blob));
        })
        .catch((err) => {
          console.error("Failed to load image via fetch", err);
          setImgSrc(finalUrl); // Fallback
        });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImgSrc(finalUrl);
    }
  }, [url]);

  if (!url) {
    return null;
  }

  if (!imgSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 animate-pulse text-gray-400 ${className}`}
        style={{ minHeight: "160px" }}
      >
        กำลังโหลดรูปภาพ...
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imgSrc} alt={alt} className={className} />
  );
}
