import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background dot-pattern p-4">
      <div className="neo-card bg-card p-8 sm:p-12 md:p-16 max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-5xl sm:text-7xl uppercase text-foreground">404</h1>
          <p className="font-bold text-lg sm:text-xl text-muted-foreground uppercase tracking-tight">
            Lost in the Huddle
          </p>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground font-medium">
          The page you're looking for doesn't exist or has been moved to another ocean.
        </p>
        <div className="pt-4">
          <button
            onClick={() => navigate("/")}
            className="neo-button bg-primary text-primary-foreground font-bold px-8 py-3 text-sm uppercase flex items-center justify-center gap-2 w-full"
          >
            <Home className="h-4 w-4" /> Return to Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
