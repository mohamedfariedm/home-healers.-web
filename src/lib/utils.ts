import { clsx, type ClassValue } from "clsx";
import { getI18n } from "react-i18next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* export function GetLocaleDir() {
  const locale = getI18n().language;
  const dir = getI18n().dir(locale);
  return { locale, dir };
}
 */

export function AvatarFallbackName(name: string) {
  return name
    ? name?.split(" ")?.length > 1
      ? name?.split(" ")?.[0]?.charAt(0) + name?.split(" ")?.[1]?.charAt(0)
      : name?.split(" ")?.[0]?.charAt(0) + name?.split(" ")?.[0]?.charAt(1)
    : "";
}

const getFileTypeIcon = (file: File) => {
  const fileType = file.type || file.name.split(".").pop();

  if (!fileType) return "unknown"; // Handle unknown or unsupported file types

  if (fileType.startsWith("image/")) {
    return "image-icon"; // Icon for images
  }

  if (fileType === "application/pdf") {
    return "pdf-icon"; // Icon for PDFs
  }

  if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileType === "application/msword"
  ) {
    return "word-icon"; // Icon for Word documents
  }

  if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    fileType === "application/vnd.ms-excel"
  ) {
    return "sheet-icon"; // Icon for Excel or sheet files
  }

  if (fileType.startsWith("video/")) {
    return "video-icon"; // Icon for video files
  }

  if (fileType.startsWith("audio/")) {
    return "audio-icon"; // Icon for audio files
  }

  return "default-file-icon"; // Fallback for other types
};


 /*  const getFileIcon = () => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      default:
        return <FiFileText />;
    }
  }; */