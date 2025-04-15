import { ApolloClient, InMemoryCache } from "@apollo/client";

export function createClient(session: string) {
  return new ApolloClient({
    uri: "http://prod-team-28-gr7l7i81.REDACTED/api/",
    credentials: "include",
    cache: new InMemoryCache(),
    headers: {
      auth: session,
    },
  });
  
}
