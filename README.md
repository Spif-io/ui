# @spifio/ui

Shared SvelteKit 5 UI primitives for Spif.io dealer websites. Consumed by
every dealer site (Del Motors, Dream Garage AZ, future dealers) so that
common components — `VehicleCard`, `Button`, `FormField` — ship once and
get improved everywhere at once.

## What's in it

This is an intentionally small MVP. Phase A of the architecture review.

| Component | Purpose |
|-----------|---------|
| `Button` | Filled / outline / white / dark-outline primitive. Renders as `<a>` or `<button>`. |
| `FormField` | Labeled input / textarea / select with required + error handling. |
| `VehicleCard` | Inventory tile with price, title, featured/sold states, optional badge row. |

Plus a `CardVehicle` TypeScript type for consumers to use as their display-layer
vehicle shape.

## Install

Private package — not published to npm. Install directly from GitHub:

```bash
pnpm add github:Spif-io/ui
```

The `prepare` npm lifecycle script runs `svelte-package` during install, so the
`dist/` folder is built on the consumer's machine without needing to commit it.

## Token contract

The components do not hardcode brand colors. They reference Tailwind v4 color
utilities that resolve to CSS variables the consuming site must define. The
minimum set:

| Token | Used by | What DM sets | What DG sets |
|-------|---------|--------------|--------------|
| `--primary` / `--primary-foreground` | Button, VehicleCard CTA | blue oklch | red hex |
| `--foreground` / `--background` | all | near-black / white | slate / white |
| `--card` / `--card-foreground` | Button, FormField, VehicleCard | white / near-black | white / slate |
| `--border` | FormField, VehicleCard | light grey | DG border |
| `--muted` / `--muted-foreground` | FormField, VehicleCard | near-white / mid-grey | DG light / DG muted |
| `--destructive` / `--destructive-foreground` | FormField errors, VehicleCard "Sold" | red | red |
| `--secondary` / `--accent` / `--ring` / `--radius` | VehicleCard gradients, focus rings | (shadcn defaults) | mapped |

In each consuming `app.css`, expose them with Tailwind v4 `@theme inline`:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ...and so on for every token the library uses... */
}
```

Del Motors already ships the full shadcn token set — no changes needed.
Dream Garage AZ needs a small addition block in its `app.css` mapping its
existing `dg-*` tokens to the standardized names. See the migration note in
the Spif.io component audit doc.

## Working on the library

```bash
pnpm install       # install deps (including the package's prepare hook)
pnpm dev           # opens the playground at http://localhost:5173
pnpm check         # run svelte-check
pnpm package       # regenerate dist/ for consumers
```

The playground (`src/routes/+page.svelte`) shows every component with live
examples so you can see any change immediately without having to rebuild a
consuming site.

## What's not in it (yet)

The architecture review's Phase A explicitly stops at 3 components. Everything
else — `Header`, `Footer`, `Accordion`, `TestimonialSlider`, `SplitSection`,
the vehicle gallery, etc. — stays in the consuming site for now. Those
graduate into this library during Phase 3 of the architecture review, once
the design team has had a chance to decide which patterns are genuinely
shared versus which are per-dealer expression.

## License

MIT.
