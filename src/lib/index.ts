/**
 * @spifio/ui — shared SvelteKit 5 UI primitives for Spif.io dealer sites.
 *
 * Consume from a SvelteKit project:
 *
 *   import { Button, FormField, VehicleCard, type CardVehicle } from '@spifio/ui';
 *
 * Every visual component references design tokens the consuming site defines in
 * its own `app.css` (via Tailwind v4 `@theme inline` blocks). See README.md for
 * the list of tokens each consumer must expose.
 */
export { default as Button } from './Button.svelte';
export { default as FormField } from './FormField.svelte';
export { default as VehicleCard } from './VehicleCard.svelte';
export type { CardVehicle } from './types.js';
