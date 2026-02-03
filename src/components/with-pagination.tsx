import { Pagination, PaginationProps } from "./pagination";
import React from "react";

interface WithPaginationProps {
  pagination?: PaginationProps;
  children: React.ReactNode;
  containerClassName?: string;
  contentClassName?: string;
}

export function WithPagination({
  pagination,
  children,
  containerClassName = "flex flex-col min-h-[600px]",
  contentClassName = "flex-1",
}: WithPaginationProps) {
  return (
    <div className={containerClassName}>
      {/* Contenido principal */}
      <div className={contentClassName}>{children}</div>
      {/* Paginación al fondo */}
      {pagination && (
        <div className="mt-6 border-t pt-4">
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  );
}
