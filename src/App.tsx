import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import DetectPage from "./pages/DetectPage";
import AdvisoryPage from "./pages/AdvisoryPage";
import AccountPage from "./pages/AccountPage";
import ChatPage from "./pages/ChatPage";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/detect" element={<DetectPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/advisory" element={<AdvisoryPage />} />
          <Route path="/assistant" element={<ChatPage />} />
          <Route path="/assistant/account" element={<AccountPage />} />
          <Route path="/assistant/chat" element={<ChatPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
