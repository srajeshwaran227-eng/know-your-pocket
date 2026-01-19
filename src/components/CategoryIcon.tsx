import { 
  UtensilsCrossed, 
  Car, 
  ShoppingBag, 
  Gamepad2, 
  BookOpen, 
  Receipt, 
  Heart, 
  MoreHorizontal,
  Wallet,
  Coffee,
  Home,
  Plane,
  Gift,
  Music,
  Smartphone,
  Shirt,
  LucideIcon
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Gamepad2,
  BookOpen,
  Receipt,
  Heart,
  MoreHorizontal,
  Wallet,
  Coffee,
  Home,
  Plane,
  Gift,
  Music,
  Smartphone,
  Shirt,
};

export const availableIcons = Object.keys(iconMap);

interface CategoryIconProps {
  iconName: string;
  className?: string;
  size?: number;
}

export function CategoryIcon({ iconName, className, size = 20 }: CategoryIconProps) {
  const Icon = iconMap[iconName] || MoreHorizontal;
  return <Icon className={className} size={size} />;
}
