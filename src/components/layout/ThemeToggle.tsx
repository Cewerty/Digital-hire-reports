// import { Moon, Sun } from "lucide-react";

// import { useTheme } from "@/lib/theme";

// export function ThemeToggle() {
//   const { theme, toggleTheme } = useTheme();
//   const isDark = theme === "dark";
//   const label = isDark ? "Включить светлую тему" : "Включить тёмную тему";

//   return (
//     <button
//       type="button"
//       onClick={toggleTheme}
//       aria-label={label}
//       aria-pressed={isDark}
//       title={label}
//       className="rounded-lg p-2 text-slate-600 transition-colors duration-150 hover:bg-slate-200/60 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-slate-400 dark:hover:bg-[#2A2A2A] dark:hover:text-[#E3E3E3] dark:focus-visible:ring-offset-[#191919]"
//     >
//       {isDark ? (
//         <Sun className="h-4 w-4" aria-hidden="true" />
//       ) : (
//         <Moon className="h-4 w-4" aria-hidden="true" />
//       )}
//     </button>
//   );
// }
