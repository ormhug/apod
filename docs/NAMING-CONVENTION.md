# Naming Conventions

## Components

Use **PascalCase** for all React component names. Names should be descriptive and meaningful. Always use arrow functions.

```tsx
// Good
const UserCard = () => { ... }
const ProfileHeader = () => { ... }

// Bad
const UserCard_Component = () => { ... }
const profile_header = () => { ... }
```

## Files

- **PascalCase** for React component files — the file name must match the component name exactly.
- **dash-case** for all other files (services, utilities, lib, etc.).

```
components/NavBar.tsx          // React component
contexts/UserAuthContext.tsx   // React component (context)
pages/DashboardPage.tsx        // React component (page)
services/auth-service.ts       // Non-component file
lib/apollo-client.ts           // Non-component file
```

### Co-located files

When a component grows to need supporting files, keep them in the same directory and prefix them with the component name using a dot separator:

| File                    | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| `FileViewer.tsx`        | Main component                                         |
| `FileContent.tsx`       | Sub-component used only by `FileViewer`                |
| `Sidebar.tsx`           | Sub-component used only by `FileViewer`                |
| `Directory.tsx`         | Sub-component used only by `FileViewer`                |
| `File.tsx`              | Sub-component used only by `FileViewer`                |
| `FileViewer.helpers.ts` | Helper functions scoped to this feature                |
| `FileViewer.types.ts`   | TypeScript types shared across files in this directory |
| `useSidebar.ts`         | Hook scoped to the `Sidebar` component                 |

The suffixes follow this pattern:

- **`ComponentName.helpers.ts`** — pure functions and logic that support the component but contain no JSX
- **`ComponentName.types.ts`** — TypeScript types and interfaces used by more than one file in the directory
- **`useComponentName.ts`** — hook scoped to a single component; named after that component with the `use` prefix

Sub-components that belong exclusively to one parent component live in the same directory without the dot prefix. If a sub-component is needed elsewhere, move it to `components/`.

## Folder Structure

```
/assets       Images and static assets
/components   Shared components used across multiple pages
/contexts     Context API providers (kept separate from regular components)
/lib          Third-party library initialization and configuration
/pages        Page-level components, one per route
/services     API methods and business logic
/styles       Global and generated styles
AppRoutes.tsx Centralized route configuration
index.tsx     Application entry point
```

### Next.js App Router

The `app/` directory drives routing. A route is only publicly accessible when a `page.tsx` or `route.ts` file exists in the segment folder.

#### Reserved file names

These file names have special meaning to Next.js and must be lowercase:

| File               | Purpose                                                              |
| ------------------ | -------------------------------------------------------------------- |
| `layout.tsx`       | Shared UI wrapping child segments (persists across page transitions) |
| `page.tsx`         | Unique UI for a route — makes the segment publicly accessible        |
| `loading.tsx`      | Suspense boundary shown while the segment loads                      |
| `error.tsx`        | Error boundary for the segment                                       |
| `not-found.tsx`    | UI rendered when `notFound()` is thrown                              |
| `global-error.tsx` | Error boundary wrapping the root layout                              |
| `template.tsx`     | Like `layout.tsx` but re-mounted on every navigation                 |
| `default.tsx`      | Fallback UI for parallel routes                                      |
| `route.ts`         | API endpoint (no UI)                                                 |

#### Folder naming conventions

| Convention             | Example                 | Effect                                                                                           |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------ |
| Plain folder           | `app/blog/`             | Adds `/blog` segment to the URL                                                                  |
| Dynamic segment        | `app/blog/[slug]/`      | Matches any single value: `/blog/my-post`                                                        |
| Catch-all segment      | `app/shop/[...slug]/`   | Matches one or more segments: `/shop/a/b/c`                                                      |
| Optional catch-all     | `app/docs/[[...slug]]/` | Matches zero or more segments: `/docs` or `/docs/a/b`                                            |
| Route group            | `app/(marketing)/`      | Groups routes for layout/organization — **omitted from the URL**                                 |
| Private folder         | `app/blog/_components/` | Excluded from routing — safe for UI utilities and helpers. All nested folders are also excluded. |
| Parallel route slot    | `app/@sidebar/`         | Named slot rendered by the parent layout alongside `@children`                                   |
| Same-level intercept   | `app/(.)photo/`         | Renders another route as an overlay without changing the URL                                     |
| Parent-level intercept | `app/(..)photo/`        | Intercepts one level up                                                                          |
| Root intercept         | `app/(...)photo/`       | Intercepts from the app root                                                                     |

#### Route groups

Wrap a folder name in parentheses to group routes without affecting the URL. Use this to:

- Share a layout across a subset of routes without adding a URL segment.
- Create multiple root layouts (remove the top-level `layout.tsx` and add one per group).

```
app/
  (marketing)/
    layout.tsx        ← applies only to routes inside (marketing)
    page.tsx          → /
    about/page.tsx    → /about
  (shop)/
    layout.tsx        ← applies only to routes inside (shop)
    cart/page.tsx     → /cart
```

#### Private folders

Prefix a folder with `_` to exclude it and all its nested folders from the routing system. Use this to colocate implementation files next to the routes that use them without risking accidental exposure.

```
app/
  blog/
    [slug]/
      page.tsx
    _components/
      PostCard.tsx    ← not routable
    _lib/
      data.ts         ← not routable
```

## Props

Use **camelCase** with descriptive names. Avoid abbreviations unless they are universally understood.

```tsx
// Good
<UserCard userId={1} displayName="Alice" isActive={true} />

// Bad
<UserCard uid={1} dn="Alice" act={true} />
```

## State Variables

Prefix boolean state variables with `is`, `has`, or `should`.

```ts
const [isActive, setIsActive] = useState(false);
const [hasError, setHasError] = useState(false);
const [shouldRender, setShouldRender] = useState(true);
```

## Event Handlers

Prefix event handler functions with `handle`.

```ts
const handleClick = () => { ... }
const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => { ... }
```

When passed as props, use the `on` prefix for the prop name:

```tsx
<Button onClick={handleClick} onInputChange={handleInputChange} />
```

## Constants

Use **SCREAMING_SNAKE_CASE** for module-level constants.

```ts
const API_URL = 'https://api.example.com';
const MAX_RESULTS = 50;
```

## Utility Functions

Use **camelCase** with names that describe what the function does, not how.

```ts
const formatDate = (date: Date): string => { ... }
const generateUniqueId = (): string => { ... }
```

## Hooks

Prefix all hooks with `use`.

```ts
const useAuth = () => { ... }
const useWindowSize = () => { ... }
```

## Types and Interfaces

Use **PascalCase**. Prefer descriptive names that model the domain.

```ts
interface UserProfile { ... }
type ButtonVariant = "primary" | "secondary" | "danger";
```

## CSS Classes

Use **lowercase with hyphens** (kebab-case).

```css
.user-card-container { ... }
.profile-header-title { ... }
```

## Exports

Prefer **named exports** over default exports for better IDE discoverability and refactoring support.

```ts
// Good
export const UserCard = () => { ... }

// Avoid
const UserCard = () => { ... }
export default UserCard;
```
