"use client";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";
import React from "react";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      // Show all pages if total pages <= 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show the first page
      pages.push(1);

      // Show pages around the current page
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 2);
        i <= Math.min(totalPages - 1, page + 2);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");

      // Always show the last page
      pages.push(totalPages);
    }

    return pages.map((pageNumber, index) =>
      typeof pageNumber === "number" ? (
        <button
          key={index}
          disabled={page === pageNumber}
          onClick={() => changePage(pageNumber)}
          className={`px-2 rounded-sm text-sm font-semibold ${
            page === pageNumber ? "bg-macSky text-white" : ""
          }`}
        >
          {pageNumber}
        </button>
      ) : (
        <span key={index} className="px-2">
          ...
        </span>
      )
    );
  };

  return (
    <div className="flex items-center justify-between p-4 text-gray-500">
      {/* Previous Button */}
      <button
        disabled={!hasPreviousPage}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(page - 1)}
      >
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">{renderPageNumbers()}</div>

      {/* Next Button */}
      <button
        disabled={!hasNextPage}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
