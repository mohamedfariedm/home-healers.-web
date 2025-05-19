"use client";

import { useCallback } from "react";
import ReactPaginate from "react-paginate";
import { IoArrowBackOutline } from "react-icons/io5";
import { useCustomSearchParams } from "@/Hooks/useCustomSearchParams";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  lastPage: number;
}

export default function Pagination({ lastPage }: PaginationProps) {
  const { t } = useTranslation("common");

  const { searchParams, setSearchParams } = useCustomSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const handlePageChange = useCallback(
    ({ selected }: { selected: number }) => {
      setSearchParams("page", String(selected + 1), "replace", true);
    },
    [setSearchParams]
  );

  const handlePrevClick = useCallback(() => {
    if (page > 1) {
      setSearchParams("page", String(page - 1), "replace", true);
    }
  }, [page, setSearchParams]);

  const handleNextClick = useCallback(() => {
    if (page < lastPage) {
      setSearchParams("page", String(page + 1), "replace", true);
    }
  }, [page, lastPage, setSearchParams]);

  if (lastPage <= 1 || !lastPage) {
    return null;
  }

  return (
    <div className="flex  justify-start md:justify-between items-center w-full gap-2 md:gap-4  ">
      <button
        className="flex items-center justify-center w-8 h-8 md:w-fit gap-1.5 rounded-lg shadow transition-colors text-Components-button-tertiary-fg border border-Components-button-secondary-border md:border-none bg-Components-button-secondary-bg md:bg-transparent hover:text-text-secondary-hover disabled:cursor-not-allowed disabled:hover:text-Components-button-tertiary-fg leading-tight text-sm group"
        onClick={handlePrevClick}
        disabled={page === 1}
      >
        <div className="shrink-0 w-4 h-4 relative overflow-hidden ">
          <div className="rtl:rotate-180 absolute inset-0">
            <IoArrowBackOutline className="w-4 h-4    group-enabled:group-hover:-translate-x-5   transition ease-in-out duration-500 " />
          </div>
          <div className="rtl:rotate-180 absolute inset-0">
            <IoArrowBackOutline className="w-4 h-4  group-enabled:group-hover:translate-x-0 translate-x-5 transition ease-in-out duration-500" />
          </div>
        </div>
        <span className="hidden md:block">{t("pagination.previous")}</span>
      </button>

      <div className="block md:hidden text-sm text-foreground-secondary-700">
        {t("pagination.current_page", { page, lastPage })}
      </div>
      <ReactPaginate
        previousLabel={null}
        nextLabel={null}
        breakLabel={
          <span className="flex items-center justify-center w-8 h-8 text-text-tertiary-600 hover:text-text-secondary-hover hover:bg-background-primary-hover rounded-full pb-1.5 transition-colors">
            ...
          </span>
        }
        pageCount={lastPage}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName=" justify-center items-center gap-2 hidden md:flex"
        pageClassName="relative text-text-tertiary-600 hover:text-text-secondary-hover"
        pageLinkClassName="flex items-center justify-center w-8 h-8 rounded-full text-sm transition-colors hover:bg-background-primary-hover"
        activeClassName="!text-text-secondary-hover"
        activeLinkClassName="bg-background-primary-hover hover:bg-background-primary-hover"
        previousClassName="hidden"
        nextClassName="hidden"
        disabledClassName="opacity-50 cursor-not-allowed"
        forcePage={page - 1}
        renderOnZeroPageCount={null}
      />

      <button
        className="flex items-center justify-center w-8 h-8 md:w-fit gap-1.5 rounded-lg shadow transition-colors text-Components-button-tertiary-fg border border-Components-button-secondary-border md:border-none bg-Components-button-secondary-bg md:bg-transparent hover:text-text-secondary-hover disabled:cursor-not-allowed disabled:hover:text-Components-button-tertiary-fg leading-tight text-sm group"
        onClick={handleNextClick}
        disabled={page === lastPage}
      >
        <span className="hidden md:block">{t("pagination.next")}</span>
        <div className="shrink-0 w-4 h-4 relative overflow-hidden ">
          <div className="rotate-180 rtl:rotate-0 absolute inset-0">
            <IoArrowBackOutline className="w-4 h-4    group-enabled:group-hover:-translate-x-5   transition ease-in-out duration-500 " />
          </div>
          <div className="rotate-180 rtl:rotate-0 absolute inset-0">
            <IoArrowBackOutline className="w-4 h-4  group-enabled:group-hover:translate-x-0 translate-x-5 transition ease-in-out duration-500" />
          </div>
        </div>
      </button>
    </div>
  );
}
