import { Text, Pressable } from "react-native";
import type { PressableProps, TextProps } from "react-native";

export interface LabelProps extends Omit<PressableProps & TextProps, "children"> {
  children: string;
  nativeID?: string;
}

export function Label({ children, nativeID, onPress, style, ...props }: LabelProps) {
  return (
    <Pressable onPress={onPress}>
      <Text
        nativeID={nativeID}
        style={style}
        {...props}
      >
        {children}
      </Text>
    </Pressable>
  );
} 