# Development Plan — APOD App Extension

**Developer:** Zukovskis  
**Duration:** 8 working days  
**Goal:** Add navigation, a calendar date-picker, and a multi-date gallery with pagination to the existing APOD app.

---

## What exists

| File                       | What it does                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `app/page.tsx`             | Fetches today's APOD, renders title, explanation, standard image, and HD modal button |
| `components/ApodModal.tsx` | Headless UI dialog that shows the HD image                                            |

**Known issues to fix on Day 1:**

- `getApod()` is called twice in `app/page.tsx` — once at module scope (result discarded) and once inside the component.
- `ApodModal.tsx` exports `function Example` — the function name must match the file name (`ApodModal`).
- `ApodData` type is defined inline in `page.tsx` — it needs to be shared across the app.

---

## Target routes

| Route          | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `/`            | Today's APOD (existing page, updated)                       |
| `/apod/[date]` | APOD for a specific date                                    |
| `/calendar`    | Date picker — single date or date range                     |
| `/gallery`     | Vertical list for a date range, paginated (max 10 per page) |

---

## NASA APOD API parameters

Base URL: `https://api.nasa.gov/planetary/apod`

| Parameter    | Type         | Default | Description                                                                    |
| ------------ | ------------ | ------- | ------------------------------------------------------------------------------ |
| `api_key`    | string       | —       | Required. Read from `process.env.NEXT_NASA_API_KEY`, fall back to `'DEMO_KEY'` |
| `date`       | `YYYY-MM-DD` | today   | Single date. Cannot be combined with `start_date`.                             |
| `start_date` | `YYYY-MM-DD` | —       | Start of a date range.                                                         |
| `end_date`   | `YYYY-MM-DD` | today   | End of a date range. Only used with `start_date`.                              |

---

## Day 1 — Foundation: shared types, service layer, bug fixes

### Files to create

**`app/apod.types.ts`**

```ts
export interface ApodData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  media_type: 'image' | 'video';
}
```

**`services/apod-service.ts`**

```ts
// getApod — single date or today
export const getApod = async (date?: string): Promise<ApodData> =>

// getApodRange — array ordered oldest-first
export const getApodRange = async (
  startDate: string,
  endDate?: string        // defaults to today if omitted
): Promise<ApodData[]> =>
```

Both functions must:

- Read `API_KEY` from `process.env.NEXT_NASA_API_KEY ?? 'DEMO_KEY'`
- Throw a descriptive error if the response is not `ok`

### Files to update

- **`components/ApodModal.tsx`** — rename `Example` → `ApodModal`
- **`app/page.tsx`** — remove the top-level `await getApod()` call; import `getApod` from `services/apod-service.ts`; import `ApodData` from `app/apod.types.ts`

---

## Day 2 — Navigation + routing skeleton

### Files to create

**`components/Navigation.tsx`** — `'use client'` component

Render a `<nav>` with two links:

- "Today" → `/`
- "Calendar" → `/calendar`

Use `usePathname()` from `next/navigation` to apply an active style to the current link.

**`app/apod/[date]/page.tsx`** — server component

```ts
// Receives { params: { date: string } } from the router
// Calls getApod(params.date)
// Renders the same layout as the existing homepage
// No separate component needed yet — duplicate the layout, refactor later
```

### Files to update

**`app/layout.tsx`**

- Import and render `<Navigation />` above `{children}` inside `<body>`
- Replace the placeholder `<title>` (`"Create Next App"`) with `"APOD"`

---

## Day 3 — Date-specific APOD page

### Goal

`/apod/2024-01-15` shows the APOD for that date using the same visual layout as the homepage.

### Extract a shared component

**`components/ApodView.tsx`** — server component (no `'use client'`)

Move the existing hero layout out of `app/page.tsx` into this component.

```ts
interface ApodViewProps {
  apod: ApodData;
}
export const ApodView = ({ apod }: ApodViewProps) =>
```

### Update both pages

- `app/page.tsx` — call `getApod()` (no date), render `<ApodView apod={apod} />`
- `app/apod/[date]/page.tsx` — call `getApod(params.date)`, render `<ApodView apod={apod} />`

### Type safety for route params

```ts
interface PageProps {
  params: Promise<{ date: string }>;
}
```

> **Note:** In this version of Next.js, `params` is a Promise. Always `await params` before accessing its properties.

---

## Day 4 — Calendar page: single-date selection

### Files to create

**`app/calendar/page.tsx`** — `'use client'`

State:

```ts
const [mode, setMode] = useState<'single' | 'range'>('single');
const [selectedDate, setSelectedDate] = useState<string>('');
const [startDate, setStartDate] = useState<string>('');
const [endDate, setEndDate] = useState<string>('');
```

For single-date mode:

- Render a `<input type="date">` (or `<Calendar />` component — see below)
- On submit, call `router.push('/apod/' + selectedDate)` from `next/navigation`

**`components/Calendar.tsx`** — `'use client'`

```ts
// Single-date mode props
interface SingleCalendarProps {
  mode: 'single';
  value: string;           // YYYY-MM-DD
  onChange: (date: string) => void;
  max?: string;            // prevent selecting future dates
}

// Range mode props
interface RangeCalendarProps {
  mode: 'range';
  startValue: string;
  endValue: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  max?: string;
}

type CalendarProps = SingleCalendarProps | RangeCalendarProps;
export const Calendar = (props: CalendarProps) =>
```

Set `max` to today's date in both modes to prevent requesting future APODs.

---

## Day 5 — Calendar page: date range + redirect to gallery

### Extend `app/calendar/page.tsx`

Add a toggle between `'single'` and `'range'` mode.

For range mode:

- Render `<Calendar mode="range" ... />`
- Validate that `startDate` is not after `endDate`
- On submit, redirect:

```ts
router.push(`/gallery?start_date=${startDate}&end_date=${endDate}&page=1`);
```

### Helper function

Add to `services/apod-service.ts` or a new `services/date-helpers.ts`:

```ts
// Returns today's date as YYYY-MM-DD
export const getTodayString = (): string =>

// Returns the number of days between two YYYY-MM-DD strings (inclusive)
export const countDays = (startDate: string, endDate: string): number =>
```

---

## Day 6 — Gallery page: layout + APOD list

### Files to create

**`app/gallery/page.tsx`** — server component

Search params interface:

```ts
interface GallerySearchParams {
  start_date: string;
  end_date?: string;
  page?: string; // defaults to '1'
}
```

Logic:

1. Parse `page` as a number (default `1`)
2. Call `getApodRange(start_date, end_date)`
3. Slice the result to 10 items for the current page: `items.slice((page - 1) * 10, page * 10)`
4. Pass `totalItems` and `currentPage` to `<Pagination />`
5. Map each item to `<ApodCard apod={item} />`

> **Note:** In this version of Next.js, `searchParams` is also a Promise. Always `await searchParams` before reading its properties.

**`components/ApodCard.tsx`** — server component

```ts
interface ApodCardProps {
  apod: ApodData;
}
export const ApodCard = ({ apod }: ApodCardProps) =>
```

Renders vertically:

- Date label (small, muted)
- Title
- Standard-resolution image (`apod.url`) at a fixed height
- HD image button → opens `<ApodModal hdurl={apod.hdurl} title={apod.title} />`

Note: `<ApodModal>` is `'use client'` — it can be imported inside the server `ApodCard` because it only renders on the client side at the leaf.

---

## Day 7 — Pagination

### Files to create

**`components/Pagination.tsx`** — `'use client'`

```ts
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;        // e.g. '/gallery?start_date=...&end_date=...'
}
export const Pagination = ({ currentPage, totalPages, basePath }: PaginationProps) =>
```

Renders: Previous | 1 2 3 … | Next

Each page number and arrow is a `<Link href={basePath + '&page=' + n}>` from `next/link`. No `useState` — navigation is handled by the URL.

### Wire up in gallery

```ts
const totalPages = Math.ceil(apods.length / 10)
// Pass basePath built from start_date and end_date (without &page=)
<Pagination currentPage={page} totalPages={totalPages} basePath={...} />
```

---

## Day 8 — Polish + code review

### Tasks

1. **Update `ApodModal`** — accept an optional `buttonLabel` prop so the gallery can label it differently from the homepage (e.g. "View HD" vs "Open dialog").

2. **Handle `media_type: 'video'`** in `ApodView` and `ApodCard` — if `media_type` is `'video'`, render an `<iframe>` instead of `<img>`, and hide the HD modal button.

3. **Empty/error states** in `app/gallery/page.tsx` — show a message if the range returns zero results.

4. **Page title metadata** — add a `generateMetadata` export to `app/apod/[date]/page.tsx` and `app/gallery/page.tsx` that sets a descriptive `<title>`.

5. **Self-review against `docs/NAMING-CONVENTION.md`** — check every new file against the naming rules before the review session.

---

## File tree at completion

```
app/
  layout.tsx                    updated
  page.tsx                      updated
  apod.types.ts                 new
  apod/
    [date]/
      page.tsx                  new
  calendar/
    page.tsx                    new
  gallery/
    page.tsx                    new
components/
  Navigation.tsx                new
  ApodView.tsx                  new
  ApodCard.tsx                  new
  ApodModal.tsx                 updated
  Calendar.tsx                  new
  Pagination.tsx                new
services/
  apod-service.ts               new
  date-helpers.ts               new
```

---

## Definition of done

- [ ] All four routes render without errors
- [ ] Single-date selection redirects to `/apod/[date]` and shows the correct APOD
- [ ] Range selection redirects to `/gallery` and shows the correct APODs
- [ ] Gallery never shows more than 10 items per page
- [ ] Pagination links change the page without a full reload
- [ ] Every HD modal button opens the correct full-size image
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] Code follows `docs/NAMING-CONVENTION.md`
