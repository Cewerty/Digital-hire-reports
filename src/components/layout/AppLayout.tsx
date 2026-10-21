import { Link, Outlet } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 bg-background text-foreground">
      <header className="w-full h-16 border-b flex items-center justify-between px-4">
        <div className="w-10 h-10" />
        <nav className="flex items-center gap-4">
          <Link to="/">Главная</Link>
        </nav>
      </header>

      <main className="flex-1 w-full flex justify-center px-4">
        <div className="w-full max-w-5xl bg-card text-card-foreground shadow-md rounded-lg p-6">
          <Outlet />
        </div>
      </main>

      <footer className="w-full border-t py-4 px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg
            className="h-6 w-6 text-primary transition-transform duration-300 hover:-translate-y-1 hover:scale-110"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          <span className="text-sm font-medium">Цифровой двойник</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">© {year}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(120,120,120,0.4)]"
            aria-label="Переключить тему"
          >
            {theme === "dark" ? (
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
