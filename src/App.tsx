import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
