import { FaRegChartBar } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FiZap } from "react-icons/fi";
import { BiDollarCircle } from "react-icons/bi";
import { TFunction } from "i18next";

export const valuesList = (t: TFunction) => [
  {
    id: 1,
    heading: t("values.list.0.heading"),
    subheading: t("values.list.0.subheading"),
    icon: <FaRegChartBar />,
  },
  {
    id: 2,
    heading: t("values.list.1.heading"),
    subheading: t("values.list.1.subheading"),
    icon: <HiOutlineLightBulb />,
  },
  {
    id: 3,
    heading: t("values.list.2.heading"),
    subheading: t("values.list.2.subheading"),
    icon: <FiZap />,
  },
  {
    id: 4,
    heading: t("values.list.3.heading"),
    subheading: t("values.list.3.subheading"),
    icon: <BiDollarCircle />,
  },
];
