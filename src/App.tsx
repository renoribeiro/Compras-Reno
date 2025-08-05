
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import { ThemeProvider } from "@/hooks/useTheme";
import SupabasePrivateRoute from "@/components/auth/SupabasePrivateRoute";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import ComoFunciona from "./pages/ComoFunciona";
import Dashboard from "./pages/Dashboard";
import ShoppingList from "./pages/ShoppingList";
import Suppliers from "./pages/Suppliers";
import Quotes from "./pages/Quotes";
import QuoteDetails from "./pages/QuoteDetails";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import CreateOrder from "./pages/CreateOrder";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import SupabaseLogin from "./pages/SupabaseLogin";
import UserAccess from "./pages/UserAccess";
import MyRestaurant from "./pages/MyRestaurant";
import StartQuote from "./pages/StartQuote";
import Pricing from "./pages/Pricing";
import Admin from "./pages/Admin";
import Index from "./pages/Index";

// Create QueryClient outside component to prevent recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <SidebarProvider>
                <Routes>
                  {/* Rota principal - redireciona baseado na autenticação */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Rotas públicas */}
                  <Route path="/home" element={<Home />} />
                  <Route path="/como-funciona" element={<ComoFunciona />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/login" element={<SupabaseLogin />} />
                  
                  {/* Rotas protegidas */}
                  <Route element={<SupabasePrivateRoute />}>
                    <Route path="/dashboard" element={
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    } />
                    <Route path="/lista-compras" element={
                      <AppLayout>
                        <ShoppingList />
                      </AppLayout>
                    } />
                    <Route path="/fornecedores" element={
                      <AppLayout>
                        <Suppliers />
                      </AppLayout>
                    } />
                    <Route path="/cotacoes" element={
                      <AppLayout>
                        <Quotes />
                      </AppLayout>
                    } />
                    <Route path="/cotacoes/:id" element={
                      <AppLayout>
                        <QuoteDetails />
                      </AppLayout>
                    } />
                    <Route path="/iniciar-cotacao" element={
                      <AppLayout>
                        <StartQuote />
                      </AppLayout>
                    } />
                    <Route path="/pedidos" element={
                      <AppLayout>
                        <Orders />
                      </AppLayout>
                    } />
                    <Route path="/pedidos/:id" element={
                      <AppLayout>
                        <OrderDetails />
                      </AppLayout>
                    } />
                    <Route path="/pedidos/criar" element={
                      <AppLayout>
                        <CreateOrder />
                      </AppLayout>
                    } />
                    <Route path="/configuracoes" element={
                      <AppLayout>
                        <Settings />
                      </AppLayout>
                    } />
                    <Route path="/mensagens" element={
                      <AppLayout>
                        <Messages />
                      </AppLayout>
                    } />
                    <Route path="/acessos" element={
                      <AppLayout>
                        <UserAccess />
                      </AppLayout>
                    } />
                    <Route path="/admin" element={
                      <AppLayout>
                        <Admin />
                      </AppLayout>
                    } />
                    <Route path="/meu-negocio" element={
                      <AppLayout>
                        <MyRestaurant />
                      </AppLayout>
                    } />
                    {/* Redirecionar de /meu-restaurante para /meu-negocio */}
                    <Route path="/meu-restaurante" element={
                      <Navigate to="/meu-negocio" replace />
                    } />
                  </Route>
                  
                  {/* Rota de fallback para página não encontrada */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SidebarProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;