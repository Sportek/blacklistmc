"use client";
import Card from "@/components/landing/card";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { User } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserCard from "../../user";

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
  exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
};

export default function SearchBlacklist() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 150);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const users = await fetch(`/api/users?search=${debouncedSearch}&limit=10`);
      setUsers((await users.json()) as User[]);
      setIsLoading(false);
    };
    fetchUsers();
  }, [debouncedSearch]);

  return (
    <div className="relative h-full w-full min-h-screen flex flex-col items-center">
      <div className="flex flex-col gap-4 max-w-xl justify-center items-center p-4 z-10 w-full">
        <div className="text-6xl font-extrabold w-full text-center max-w-sm">Rechercher un blacklist.</div>

        <Card className="flex items-center gap-4 px-4 py-3 w-full">
          {isLoading ? <ArrowPathIcon className="w-6 h-6 animate-spin" /> : <MagnifyingGlassIcon className="w-6 h-6" />}
          <Input
            autoComplete="off"
            placeholder="Identifiant, pseudonyme, displayname, ..."
            className="h-full placeholder:text-white/70 bg-transparent border-none text-white w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
        </Card>

        {search && (!(isLoading || users.length === 0) || users.length > 0) && (
          <div className="bg-white bg-opacity-20 py-4 rounded-lg border border-white border-opacity-20 gap-4 w-full backdrop-blur-md">
            <div className="text-lg font-semibold px-4">
              {users.length ? `${users.length} résultats` : "Aucun résultat"}
            </div>
            {users.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={container}
                className="flex flex-col gap-2 max-h-[350px] overflow-y-auto px-4"
              >
                <AnimatePresence>
                  {users.map((user) => (
                    <motion.div variants={item} initial="hidden" animate="visible" exit="exit" key={user.id}>
                      <Link href={`/users/${user.id}`}>
                        <Card className="hover:bg-opacity-30 transition-all duration-75 ease-in-out">
                          <UserCard user={user as User & { _count: { votes: number } }} />
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
