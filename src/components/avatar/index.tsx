import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface AvatarProps {
  imageUrl: string;
  username: string;
  className?: string;
}
const UserAvatar = ({ imageUrl, username, className }: AvatarProps) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{username.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
