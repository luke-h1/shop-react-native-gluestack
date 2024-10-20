import "@/global.css";
import { Link, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShoppingCart, User } from "lucide-react-native";
import useCart from "@//store/cartStore";
import useAuth from "@//store/authStore";
import GluestackProvider from "@//components/Gluestack";
import { Pressable } from "react-native";
import { Icon } from "@//components/ui/icon";
import { Text } from "@//components/ui/text";

const queryClient = new QueryClient();

export default function RootLayout() {
  const cartItems = useCart((state) => state.items.length);

  const isAuth = useAuth((u) => !!u.token);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackProvider>
        <Stack
          screenOptions={{
            headerRight: () =>
              cartItems > 0 && (
                <Link href={"/cart"} asChild>
                  <Pressable className="flex-row gap-2">
                    <Icon as={ShoppingCart} />
                    <Text>{cartItems}</Text>
                  </Pressable>
                </Link>
              ),
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Shop",
              headerLeft: () =>
                !isAuth && (
                  <Link href={"/login"} asChild>
                    <Pressable className="flex-row gap-2">
                      <Icon as={User} />
                    </Pressable>
                  </Link>
                ),
            }}
          />
          <Stack.Screen name="product/[id]" options={{ title: "Product" }} />
        </Stack>
      </GluestackProvider>
    </QueryClientProvider>
  );
}
