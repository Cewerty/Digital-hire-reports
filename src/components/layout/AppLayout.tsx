import { Link, Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-100 p-4">
        <nav>
          <Link to="/">Главная</Link>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-4">
          {/* Хедер */}
        </header>
        <main className="p-4 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
