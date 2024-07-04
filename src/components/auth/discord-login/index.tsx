import Link from "next/link";

interface DiscordLoginProps {
  className?: string;
  children: React.ReactNode;
}

const DiscordLogin = ({ className, children }: DiscordLoginProps) => {
  const URL = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_AUTH_DISCORD_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_AUTH_DISCORD_REDIRECT_URI}&scope=email`;

  return (
    <Link href={URL} className={className}>
      {children}
    </Link>
  );
};

export default DiscordLogin;
