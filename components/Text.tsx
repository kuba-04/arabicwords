import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { cn } from "@/lib/utils";

interface TextProps extends RNTextProps {
  className?: string;
}

export function Text({ className, style, ...props }: TextProps) {
  return (
    <RNText
      className={cn("text-base text-foreground", className)}
      style={style}
      {...props}
    />
  );
} 