import { TFunction } from "i18next";
import { FiShare, FiGlobe, FiEdit3 } from "react-icons/fi";
import { HiOutlineArchive } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi2";
import { PiChatTextBold } from "react-icons/pi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { CiStar } from "react-icons/ci";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { HiOutlineBookmark } from "react-icons/hi2";
import { FiDatabase } from "react-icons/fi";

export const routes = {
  chat: "/chat",
  advice: "/advice",
  starred: "/starred",
  templates: "/templates",
  bookmarks: "/bookmarks",
  archive: "/archive",
  database: "database",
};
export const MenuItems = (t: TFunction) => [
  {
    id: 1,
    label: t("menu.0"),
    href: routes.chat,
    icon: <PiChatTextBold />,
  },
  {
    id: 2,
    label: t("menu.1"),
    href: routes.advice,
    icon: <HiOutlineLightBulb />,
  },
  {
    id: 3,
    label: t("menu.2"),
    href: routes.starred,
    icon: <CiStar />,
  },
  {
    id: 4,
    label: t("menu.3"),
    href: routes.templates,
    icon: <MdOutlineSpaceDashboard />,
  },
  {
    id: 5,
    label: t("menu.4"),
    href: routes.bookmarks,
    icon: <HiOutlineBookmark />,
  },
  {
    id: 6,
    label: t("menu.5"),
    href: routes.archive,
    icon: <HiOutlineArchive />,
  },
  {
    id: 7,
    label: t("menu.6"),
    href: routes.database,
    icon: <FiDatabase />,
  },
];
export const DropdownMenuItems = (locale: string) => [
  {
    id: 1,
    icon: <FiShare />,
    label: locale === "en" ? "Share" : "مشاركة",
  },
  {
    id: 2,
    icon: <FiGlobe />,
    label: locale === "en" ? "Public" : "عام",
  },
  {
    id: 3,
    icon: <FiEdit3 />,
    label: locale === "en" ? "Rename" : "تغيير الاسم",
  },
  {
    id: 4,
    icon: <HiOutlineArchive />,
    label: locale === "en" ? "Archive" : "ارشفة",
  },
  {
    id: 5,
    icon: <HiOutlineTrash />,
    label: locale === "en" ? "Delete" : "حذف",
    type: "delete",
  },
];
