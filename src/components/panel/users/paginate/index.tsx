"use client";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

interface UserPaginationProps {
  maxPage: number;
}
const UserPagination = ({ maxPage }: UserPaginationProps) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [nElement, setNElement] = useState(7);

  useEffect(() => {
    startTransition(() => {
      router.push(`/dashboard/users?page=${page}&search=${search}&nElement=${nElement}`);
    });
  }, [page, search, nElement, router, maxPage]);

  return (
    <div className="flex flex-row gap-2 text-black">
      <Pagination>
        <PaginationContent className="flex flex-row justify-between w-full">
          <PaginationPrevious
            className="bg-slate-400"
            onClick={() => setPage(Math.max(1, page - 1))}
            style={{ cursor: page === 1 ? "not-allowed" : "pointer" }}
          />

          <div className="flex flex-row gap-2 w-full h-full items-center bg-slate-400 rounded-md px-2 py-1">
            <MagnifyingGlassIcon className="w-6 h-6" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-full bg-transparent pl-2 border-none"
            />
          </div>

          <div className="flex flex-row gap-1">
            {Array.from({ length: maxPage }, (_, index) => (
              <PaginationItem key={index} onClick={() => setPage(index + 1)}>
                <PaginationLink
                  isActive={page === index + 1}
                  className={cn(page === index + 1 ? "bg-white" : "bg-slate-400", "cursor-pointer")}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            )).slice(0, 2)}
            <PaginationItem>
              <PaginationEllipsis className="bg-slate-400 h-full rounded-md w-10" />
            </PaginationItem>

            <PaginationNext
              className="bg-slate-400"
              onClick={() => setPage(Math.min(maxPage, page + 1))}
              style={{ cursor: page === maxPage ? "not-allowed" : "pointer" }}
            />
          </div>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default UserPagination;