import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import FormBuilder from "@/pages/form-builder";
import FormsList from "@/pages/forms-list";
import FormPreview from "@/pages/form-preview";

function Router() {
  return (
    <Switch>
      <Route path="/" component={FormsList} />
      <Route path="/forms" component={FormsList} />
      <Route path="/form-builder" component={FormBuilder} />
      <Route path="/form-preview/:id" component={FormPreview} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
