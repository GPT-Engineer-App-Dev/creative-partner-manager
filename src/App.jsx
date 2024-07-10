import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home, Users, Settings } from "lucide-react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import Layout from "./layouts/sidebar";
import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import SettingsPage from "./pages/Settings";
const queryClient = new QueryClient();

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Partners",
    to: "/partners",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <DragDropContext>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="partners" element={<Partners />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </DragDropContext>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;