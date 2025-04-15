import { ThemeProvider } from "@/components/theme-provider.tsx";
import { RouterConfig } from "./router.tsx";
import { ApolloProvider } from "@apollo/client";
import { createClient } from "./apollo/client.ts";
import { useCookies } from "react-cookie";

export default function Wrapper() {
  const [cookies] = useCookies(["PROD_SESSION"]);

  return (
    <ApolloProvider client={createClient(cookies.PROD_SESSION)}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterConfig />
      </ThemeProvider>
    </ApolloProvider>
  );
}
