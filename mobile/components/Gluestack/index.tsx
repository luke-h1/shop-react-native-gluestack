import { ReactNode } from "react";
import { ColorSchemeName, useColorScheme, View, ViewProps } from "react-native";
import { colorScheme as colorSchemeNativeWind } from "nativewind";
import { config } from "./config";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";

type Theme = "light" | "dark" | "system";

const getColorScheme = (
  colorScheme: ColorSchemeName,
  mode: Theme
): Omit<Theme, "system"> => {
  if (mode === "system") {
    return colorScheme ?? "light";
  }
  return mode;
};

interface Props {
  mode?: Theme;
  children: ReactNode;
  style?: ViewProps["style"];
}

export default function GluestackProvider({ mode = "light", ...props }: Props) {
  const colorScheme = useColorScheme();

  const colorSchemeName = getColorScheme(colorScheme, mode);

  colorSchemeNativeWind.set(mode);

  return (
    <View
      style={[
        config[colorSchemeName as "light" | "dark"],
        {
          flex: 1,
          height: "100%",
          width: "100%",
        },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
