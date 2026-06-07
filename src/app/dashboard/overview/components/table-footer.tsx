import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROW_PER_PAGE } from "@/constants/dashboard";
import useGetPaginationTokens from "@/hooks/useGetPaginationTokens";
import { cn } from "@/lib/utils";

const itemsSelectRow = ROW_PER_PAGE.map((item) => ({
  label: item,
  value: item,
}));

interface TableFooterProps {
  page: number;
  limit: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onChangeLimit: (limit: number) => void;
}

export const TableFooter = ({
  page,
  limit,
  totalPages,
  onChangePage,
  onNextPage,
  onPreviousPage,
  onChangeLimit,
}: TableFooterProps) => {
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const paginationTokens = useGetPaginationTokens(page, totalPages);

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2 items-center shrink-0">
        <p className="">Rows per page</p>
        <Select
          items={itemsSelectRow}
          onValueChange={(newLimit) => onChangeLimit(Number(newLimit))}
          value={limit}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {itemsSelectRow.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className={"text-sm"}
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Pagination className="justify-end">
        <PaginationContent key={`${page}-${totalPages}`}>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={!canGoPrev}
              tabIndex={!canGoPrev ? -1 : undefined}
              className={cn(!canGoPrev && "pointer-events-none opacity-50")}
              onClick={(e) => {
                e.preventDefault();
                if (!canGoPrev) return;
                onPreviousPage();
              }}
            />
          </PaginationItem>

          {paginationTokens.map((token, idx) => {
            if (token === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={token}>
                <PaginationLink
                  isActive={token === page}
                  onClick={(e) => {
                    e.preventDefault();
                    onChangePage(token);
                  }}
                >
                  {token}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              aria-disabled={!canGoNext}
              tabIndex={!canGoNext ? -1 : undefined}
              className={cn(!canGoNext && "pointer-events-none opacity-50")}
              onClick={(e) => {
                e.preventDefault();
                if (!canGoNext) return;
                onNextPage();
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
