# Recipe Explorer

A Next.js 15 App Router app that explores TheMealDB categories and recipes.

## Run locally

```bash
npm install
npm run dev
```

## Fetch caching in Next.js

`force-cache` opts a fetch into the persistent Data Cache until its entry is
revalidated or invalidated. `next: { revalidate: seconds }` also caches the
response, then allows it to be refreshed after the given interval. `no-store`
always performs a fresh request and does not persist the response.

Next.js 14 cached eligible `fetch` requests by default (`force-cache`). In
Next.js 15 the default is no longer to persist fetch responses (`no-store` /
`auto no cache` behavior), so request-level caching should be explicit when
desired. This app explicitly revalidates categories daily and meals hourly.

## Streaming

The meal page renders its recipe details before awaiting related recipes.
Wrapping the related section in `<Suspense>` lets Next.js send the main recipe
immediately and stream the recommendations into the fallback's place when they
finish. The fallback communicates that more content is on its way, improving
perceived performance without changing how long the related API request takes.
In development, recommendations wait an extra second so the streaming state is
easy to observe; production requests do not include that delay.
