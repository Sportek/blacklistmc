"use client";
import Shield from "@/components/icons/shield";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { User, UserStatus } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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

export default function Home() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 150);

  const getStatusBadge = useCallback((status: UserStatus) => {
    if (status === UserStatus.BLACKLISTED) {
      return (
        <div className="bg-red-500 rounded-md gap-2 flex flex-row items-center px-2 w-fit h-fit">
          <Shield />
          Blacklist
        </div>
      );
    } else if (status === UserStatus.TRUSTED) {
      return (
        <div className="bg-green-500 rounded-md gap-2 flex flex-row items-center px-2 w-fit h-fit">
          <Check size={16} />
          Trusted
        </div>
      );
    } else {
      return (
        <div className="bg-gray-500 rounded-md gap-2 flex flex-row items-center px-2 w-fit h-fit">
          <AlertCircle size={16} />
          Unknown
        </div>
      );
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const users = await fetch(`/api/research?query=${debouncedSearch}`);
      setUsers(await users.json());
      setIsLoading(false);
    };
    fetchUsers();
  }, [debouncedSearch]);

  return (
    <div className="relative h-full w-full flex flex-col items-center">
      <div className="flex flex-col gap-4 max-w-xl justify-center items-center p-4 z-10 w-full">
        <div className="text-6xl font-extrabold w-full text-center max-w-sm">Rechercher un blacklist.</div>

        <div className="flex items-center gap-4 px-4 py-3 bg-white bg-opacity-20 rounded-lg border border-white border-opacity-20 w-full backdrop-blur-md">
          <Search size={24} />
          <Input
            placeholder="Identifiant, pseudonyme, displayname, ..."
            className="h-full placeholder:text-white/70 bg-transparent border-none text-white w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
        </div>

        {users.length > 0 ? (
          <div className="bg-white bg-opacity-20 p-4 rounded-lg border border-white border-opacity-20 gap-4 w-full backdrop-blur-md">
            <div className="text-lg font-semibold">Résultats</div>
            <motion.div initial="hidden" animate="visible" variants={container} className="flex flex-col gap-4">
              <AnimatePresence>
                {users.slice(0, Math.min(users.length, 4)).map((user) => (
                  <motion.div
                    variants={item}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white bg-opacity-20 rounded-lg p-2"
                    key={user.id}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.imageUrl} alt={user.id} />
                        <AvatarFallback className="bg-slate-900 text-white font-semibold">
                          {user.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-row gap-2 items-center">
                          <div className="text-lg font-semibold">{user.displayName}</div>
                          <div className="text-md text-white/70">@{user.username}</div>
                        </div>
                        {getStatusBadge(user.status)}
                      </div>
                    </div>
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
