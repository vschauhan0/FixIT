import { User } from "lucide-react"

interface UserIconProps {
  className?: string
}

export default function UserIcon({ className }: UserIconProps) {
  return <User className={className} />
}
