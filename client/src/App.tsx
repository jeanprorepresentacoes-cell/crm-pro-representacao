import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import LeadsCompleto from "./pages/LeadsCompleto";
import ClientesCompleto from "./pages/ClientesCompleto";
import OrcamentosCompleto from "./pages/OrcamentosCompleto";
import VendasCompleto from "./pages/VendasCompleto";
import EmpresasCompleto from "./pages/EmpresasCompleto";
import ProdutosCompleto from "./pages/ProdutosCompleto";
import Relatorios from "./pages/Relatorios";
import Comissoes from "./pages/Comissoes";
import Configuracoes from "./pages/Configuracoes";
import Importacao from "./pages/Importacao";
import VendaDetalhes from "./pages/VendaDetalhes";

function Router() {
  return (
    <Switch>
      <Route path={"/"}>
        {() => (
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/leads"}>
        {() => (
          <DashboardLayout>
            <LeadsCompleto />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/clientes"}>
        {() => (
          <DashboardLayout>
            <ClientesCompleto />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/orcamentos"}>
        {() => (
          <DashboardLayout>
            <OrcamentosCompleto />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/vendas"}>
        {() => (
          <DashboardLayout>
            <VendasCompleto />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/empresas"}>
        {() => (
          <DashboardLayout>
            <EmpresasCompleto />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/produtos"}>
        {() => (
          <DashboardLayout>
            <ProdutosCompleto />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/relatorios"}>
        {() => (
          <DashboardLayout>
            <Relatorios />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/comissoes"}>
        {() => (
          <DashboardLayout>
            <Comissoes />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/configuracoes"}>
        {() => (
          <DashboardLayout>
            <Configuracoes />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/importacao"}>
        {() => (
          <DashboardLayout>
            <Importacao />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/vendas/:id"}>
        {() => (
          <DashboardLayout>
            <VendaDetalhes />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
