import React from "react";
import { Button } from "./ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2">
      <Button
        className="size-12 rounded border px-2 py-1"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        «
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          className={`size-12 rounded border px-2 py-1 ${page === currentPage ? "bg-primary text-white" : "bg-card"}`}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
        >
          {page}
        </Button>
      ))}
      <Button
        className="size-12 rounded border px-2 py-1"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        »
      </Button>
    </nav>
  );
}
