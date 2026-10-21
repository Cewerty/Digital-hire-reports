# Project Architecture & Verification Protocol

## Stack
- Vite + React + TypeScript
- Routing: React Router v6.4+ (`createBrowserRouter`, `<RouterProvider>`, `<Outlet />`)
- UI: Tailwind CSS + local shadcn/ui components in `@/components/ui/*`
- Data: Local typed mocks in `@/mocks/*` (no backend API calls)

## Strict Coding Rules
1. Never use `any`. Define strict interfaces for all mock data and component props.
2. Never import from `shadcn-ui`. Import primitives from `@/components/ui/<component>`.
3. Use semantic Tailwind tokens (`bg-background`, `text-foreground`, `bg-card`, `border-border`).
4. Handle `undefined` safely when accessing array elements or URL params (`useParams`).

## Mandatory Quality Gate (Definition of Done)
After making any code changes, you MUST run:
`npm run verify`

- If the command fails, read the terminal output from Biome, TypeScript, or Vite.
- Fix the root cause of the error (NEVER add `// @ts-ignore` or `// biome-ignore`).
- Re-run `npm run verify` until it exits with code 0. Do not finish your response until the build succeeds.