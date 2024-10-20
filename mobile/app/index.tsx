import ProductListItem from "@//components/ProductListItem";
import { Text } from "@//components/ui/text";
import { useBreakpointValue } from "@//components/ui/utils/use-break-point-value";
import productsService from "@//services/productsService";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ActivityIndicator, FlatList } from "react-native";

export default function HomeScreen() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsService.getProducts(),
  });

  const columns = useBreakpointValue({
    default: 2,
    sm: 3,
    xl: 4,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return <Text>Error fetching products</Text>;
  }

  return (
    <FlatList
      key={columns}
      data={data}
      numColumns={columns}
      contentContainerClassName="gap-2 max-w-[960px] mx-auto w-full"
      columnWrapperClassName="gap-2"
      renderItem={({ item }) => <ProductListItem product={item} />}
    />
  );
}
