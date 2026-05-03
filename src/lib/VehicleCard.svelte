<!--
  VehicleCard — Spif.io shared inventory tile

  A merge of the two existing implementations (del-motors-dev and dream-garage-az).
  Takes DM's framework as the base (design tokens, hover animation, navigation wrap,
  configurable CTA, sold/featured handling) and adds DG's extras (trim line,
  optional badge row for mileage/color/body-style, condition badge).

  Every visual token references CSS variables the consuming site defines, so the
  same component looks "right" in both Del Motors' oklch blue theme and Dream
  Garage's hex red theme without conditional code.
-->
<script lang="ts">
  import { Gauge, ArrowUpRight } from 'lucide-svelte';
  import type { CardVehicle } from './types.js';

  interface Props {
    vehicle: CardVehicle;
    /** Label shown next to the price. Defaults to "Internet Price" which is the
     * DM convention; DG can pass "Price" or whatever they prefer. */
    priceLabel?: string;
    /** CTA button text at the bottom of the card. */
    ctaText?: string;
    /** Custom href builder. Defaults to `/inventory/{id}` which is both sites'
     * convention. Pass a function if your dealer routes differently. */
    href?: (v: CardVehicle) => string;
    /** Show the trim line below the title (from DG). Default: true. */
    showTrim?: boolean;
    /** Show the DG-style pill row (mileage, color, body style). Default: false
     * to preserve DM's cleaner look; DG can opt in. */
    showBadges?: boolean;
    /** Show the "Featured" badge when vehicle.featured is true. Default: true. */
    showFeaturedBadge?: boolean;
    /** Show a condition badge (new/used/certified). Default: false. */
    showConditionBadge?: boolean;
    /** Base price before fees. When set, enables the price breakdown view. */
    basePrice?: number;
    /** Dealer doc fee added to price. Only shown when > 0. */
    docFee?: number;
    /** Accessories fee added to price. Only shown when > 0. */
    accessoriesFee?: number;
    /** Labels for the breakdown lines. */
    basePriceLabel?: string;
    docFeeLabel?: string;
    accessoriesFeeLabel?: string;
    totalLabel?: string;
    /** When provided, the CTA becomes a button that invokes this callback
     * instead of navigating to the VDP. Used by SRP pages that want
     * "Request More Info" to open a modal directly from the listing. The
     * surrounding card stays a link — only the CTA is intercepted. */
    onCtaClick?: (v: CardVehicle) => void;
  }

  let {
    vehicle,
    priceLabel = 'Internet Price',
    ctaText = 'Request More Info',
    href = (v) => `/inventory/${v.id}`,
    showTrim = true,
    showBadges = false,
    showFeaturedBadge = true,
    showConditionBadge = false,
    basePrice,
    docFee = 0,
    accessoriesFee = 0,
    basePriceLabel = 'Display Price',
    docFeeLabel = 'Doc Fee',
    accessoriesFeeLabel = 'Accessories',
    totalLabel = 'Total',
    onCtaClick
  }: Props = $props();

  function handleCta(e: MouseEvent) {
    if (!onCtaClick) return;
    e.preventDefault();
    e.stopPropagation();
    onCtaClick(vehicle);
  }

  const showBreakdown = $derived(basePrice != null && (docFee > 0 || accessoriesFee > 0));

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const formattedPrice = $derived(
    vehicle.price == null
      ? 'Call for price'
      : new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(vehicle.price)
  );

  const formattedMileage = $derived(
    vehicle.mileage == null ? '' : new Intl.NumberFormat('en-US').format(vehicle.mileage)
  );

  const isSold = $derived(vehicle.availability?.toLowerCase() === 'sold');

  const titleLine = $derived(
    [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')
  );

  // Track terminal image failure so we render the make/model placeholder
  // instead of a broken-image icon when both the R2 thumbnail and the
  // HomeNet fallback fail (or fallback is empty).
  let imageFailed = $state(false);
  // Reset whenever the vehicle changes (Svelte reuses the component
  // when iterating over a list — without this a single bad image would
  // leave the placeholder stuck for whatever vehicle next reuses the slot).
  $effect(() => {
    vehicle.id;
    imageFailed = false;
  });

  function handleImgError(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    const fb = vehicle.fallbackImageUrl;
    if (fb && img.src !== fb) {
      img.src = fb;
      return;
    }
    // No fallback (or fallback also failed) — hide the broken <img>
    // so the make/model placeholder underneath shows through.
    imageFailed = true;
  }
</script>

<a href={href(vehicle)} class="group block{isSold ? ' opacity-75' : ''}">
  <div class="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
    <!-- Hover glow -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>

    <!-- Image -->
    <div class="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-secondary to-muted">
      {#if vehicle.imageUrl && !imageFailed}
        <img
          src={vehicle.imageUrl}
          alt="{vehicle.year} {vehicle.make} {vehicle.model}"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onerror={handleImgError}
        />
      {:else}
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center transform group-hover:scale-105 transition-transform duration-500">
            <div class="text-4xl font-bold text-muted-foreground/20">{vehicle.make}</div>
            <div class="text-lg text-muted-foreground/15">{vehicle.model}</div>
          </div>
        </div>
      {/if}

      {#if showFeaturedBadge && vehicle.featured}
        <span class="absolute left-3 top-3 z-20 rounded-full bg-gradient-to-r from-primary to-primary/80 px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25">
          Featured
        </span>
      {/if}

      {#if showConditionBadge && vehicle.condition}
        <span class="absolute right-3 top-3 z-20 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground uppercase tracking-wide">
          {vehicle.condition}
        </span>
      {/if}

      {#if isSold}
        <div class="absolute inset-0 z-30 flex items-center justify-center bg-black/40">
          <span class="rounded-md bg-destructive px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-destructive-foreground shadow-lg">
            Sold
          </span>
        </div>
      {/if}

      <!-- Hover arrow indicator -->
      <div class="absolute right-3 bottom-3 z-20 rounded-full bg-card/90 p-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
        <ArrowUpRight class="h-4 w-4 text-primary" />
      </div>
    </div>

    <!-- Content -->
    <div class="relative p-5">
      <div class="mb-3">
        <h3 class="font-semibold text-foreground text-lg group-hover:text-primary transition-colors duration-300">
          {titleLine}
        </h3>
        {#if showTrim && vehicle.trim}
          <p class="text-sm font-medium text-muted-foreground mt-0.5">{vehicle.trim}</p>
        {/if}
        {#if formattedMileage}
          <span class="inline-flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <Gauge class="h-3.5 w-3.5" />
            {formattedMileage} mi
          </span>
        {/if}
      </div>

      {#if showBadges}
        <div class="mb-4 flex flex-wrap gap-2">
          {#if vehicle.exteriorColor}
            <span class="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
              {vehicle.exteriorColor}
            </span>
          {/if}
          {#if vehicle.bodyStyle}
            <span class="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
              {vehicle.bodyStyle}
            </span>
          {/if}
        </div>
      {/if}

      <div class="py-3 border-t border-border/50">
        {#if showBreakdown}
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">{basePriceLabel}</span>
            <span class="text-sm text-muted-foreground">{fmt(basePrice!)}</span>
          </div>
          {#if docFee > 0}
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted-foreground">{docFeeLabel}</span>
              <span class="text-sm text-muted-foreground">{fmt(docFee)}</span>
            </div>
          {/if}
          {#if accessoriesFee > 0}
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted-foreground">{accessoriesFeeLabel}</span>
              <span class="text-sm text-muted-foreground">{fmt(accessoriesFee)}</span>
            </div>
          {/if}
          <div class="flex items-center justify-between mt-1">
            <span class="text-sm font-medium text-muted-foreground">{totalLabel}</span>
            <span class="text-xl font-bold text-foreground">{formattedPrice}</span>
          </div>
        {:else}
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">{priceLabel}</span>
            <span class="text-xl font-bold text-foreground">{formattedPrice}</span>
          </div>
        {/if}
      </div>

      {#if onCtaClick}
        <button
          type="button"
          onclick={handleCta}
          class="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/85 hover:scale-[1.02] hover:shadow-md hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          {ctaText}
        </button>
      {:else}
        <div class="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground group-hover:bg-primary/85 group-hover:shadow-md group-hover:shadow-primary/30 transition-all duration-200">
          {ctaText}
        </div>
      {/if}
    </div>
  </div>
</a>
