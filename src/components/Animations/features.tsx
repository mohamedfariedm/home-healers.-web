"use client";
import React, { useEffect, useState } from "react";
import { BreadCrumbComponent } from "@/components/Animations/breadCrumb";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import HomeAPI from "@/app/api/api";

interface StatsDataType {
  data?: {
    name?: string;
    description?: string;
    image?: string | { original: string }[];
  };
}

function Features() {
  const { t, i18n } = useTranslation("blog");
  const id = useParams();
  console.log(id.blogID);

  const [statsData, setStatsData] = useState<StatsDataType | null>(null);
  const locale = i18n.language || "ar";

  useEffect(() => {
    async function fetchData() {
      try {
        const blogID = Array.isArray(id.blogID) ? id.blogID[0] : id.blogID;
        if (blogID) {
          const data = await HomeAPI.getStatsData(blogID, locale);
          setStatsData(data);
        }
      } catch (error) {
        console.error("Error fetching stats data:", error);
      }
    }

    fetchData();
  }, [id.blogID, locale]);

  console.log("Stats Data:", statsData);

  return (
    <>
      <div className="p-2  xl:p-0">
        <BreadCrumbComponent
          value={"blog"}
          name={t("name")}
          name2={t("name2")}
          title={statsData?.data?.name}
        />

        <div className="main-container max-w-[1160px] w-full flex flex-col justify-center items-center text-[0px] rounded-[20px] relative mx-auto mb-10 px-4 lg:px-0">
          {/* Background Image */}
          <div
            className="w-full max-w-[1160px] h-[400px] sm:h-[500px] md:h-[550px] lg:h-[662.94px] bg-cover bg-no-repeat rounded-[20px]"
            style={{
              backgroundImage: `url(${
                Array.isArray(statsData?.data?.image)
                  ? statsData?.data?.image[0]?.original
                  : statsData?.data?.image || "/assets/images/products/main.svg"
              })`,
            }}
          />

          {/* Description */}
          {statsData?.data && (
            <span className="w-full max-w-[1100px] text-[16px] sm:text-[18px] font-medium leading-[28px] sm:leading-[32.76px] text-[#fff] text-start z-[1] mt-[32px]">
              {/* {statsData.data.name} */}
              <br />
              <strong
                dangerouslySetInnerHTML={{
                  __html: statsData.data.description || "",
                }}
              ></strong>
              <br />
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default Features;
