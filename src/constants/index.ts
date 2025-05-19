import { TFunction } from "i18next";

export const menuItems = (t: TFunction) => [
  { label: t("menu.0"), href: "/features" },
  {
    label: t("menu.1"),
    href: "/blog",
  },
  {
    label: t("menu.2"),
    href: "/contact-us",
  },
];

export const featuresList = (t: TFunction) => [
  {
    id: 1,
    heading: t("features.list.0.heading"),
    subheading: t("features.list.0.subheading"),
    image: "/assets/images/feature-1.png",
    gradientStyle:
      "radial-gradient(104.26% 100% at 0% 100%, #0B4ABF 0%, #0C111D 100%)",
    imgClassName: " justify-center pb-5 ",
  },
  {
    id: 2,
    heading: t("features.list.1.heading"),
    subheading: t("features.list.1.subheading"),
    image: "/assets/images/feature-2.png",
    gradientStyle:
      "radial-gradient(83% 91% at 50% 100%, rgba(26, 29, 255, 0.30) 11.1%, rgba(22, 70, 227, 0.37) 34.83%, rgba(0, 0, 0, 0.15) 100%)",
    imgClassName: " justify-end pb-5 ",
  },
  {
    id: 3,
    heading: t("features.list.2.heading"),
    subheading: t("features.list.2.subheading"),
    image: "/assets/images/feature-3.png",
    gradientStyle:
      "radial-gradient(64% 100% at 50% 100%, #19246B 0%, #0B0F1A 100%)",
    imgClassName: " justify-center pb-5 ",
  },
  {
    id: 4,
    heading: t("features.list.3.heading"),
    subheading: t("features.list.3.subheading"),
    image: "/assets/images/feature-4.png",
    gradientStyle:
      "radial-gradient(105% 119% at 100% 100%, rgba(153, 0, 255, 0.25) 0%, rgba(255, 255, 255, 0.00) 100%)",
    imgClassName: " justify-center  items-end",
  },
  {
    id: 5,
    heading: t("features.list.4.heading"),
    subheading: t("features.list.4.subheading"),
    image: "/assets/images/feature-5.png",
    gradientStyle:
      "radial-gradient(75% 112% at 51% 100%, #7116A6 0%, #380B52 52.14%, #0B101A 96.14%)",
    imgClassName: " justify-center  ",
  },
  {
    id: 6,
    heading: t("features.list.5.heading"),
    subheading: t("features.list.5.subheading"),
    image: "/assets/images/feature-6.png",
    gradientStyle:
      " radial-gradient(83% 91% at 50% 100%, rgba(26, 29, 255, 0.30) 11.1%, rgba(22, 70, 227, 0.37) 34.83%, rgba(0, 0, 0, 0.15) 100%)",
    imgClassName: " justify-end pb-5 pl-5",
  },
];


const path = "public/assets/images/feature-1.png";