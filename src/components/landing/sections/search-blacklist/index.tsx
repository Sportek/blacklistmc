"use client";
import Card from "@/components/landing/card";
import UserCard from "@/components/landing/user";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { User } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: { y: -20, opacity: 0, transition: { duration: 0.5 } },
};

export default function SearchBlacklist() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 150);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const users = await fetch(`/api/research?query=${debouncedSearch}`);
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
          <Search size={24} />
          <Input
            placeholder="Identifiant, pseudonyme, displayname, ..."
            className="h-full placeholder:text-white/70 bg-transparent border-none text-white w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
        </Card>

        {users.length > 0 ? (
          <div className="bg-white bg-opacity-20 p-4 rounded-lg border border-white border-opacity-20 gap-4 w-full backdrop-blur-md">
            <div className="text-lg font-semibold">Résultats</div>
            <motion.div initial="hidden" animate="visible" variants={container} className="flex flex-col gap-4">
              <AnimatePresence>
                {users.slice(0, Math.min(users.length, 4)).map((user) => (
                  <motion.div variants={item} initial="hidden" animate="visible" exit="exit" key={user.id}>
                    <Card>
                      <UserCard user={user as User & { _count: { votes: number } }} />
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : null}
      </div>
    </div>
  );
}