<!--
  Button — Spif.io shared primitive
  Four visual variants, renders as either <a href> or <button>.

  Adapted from the Dream Garage original, with hardcoded `dg-*` classes
  replaced by design tokens (`primary`, `foreground`, etc.) so the same
  component picks up each consuming site's brand colors from its app.css.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    /** Visual variant. `primary` is the default filled CTA; `outline` is a bordered
     * version; `white` is for use over colored backgrounds; `dark-outline` is
     * for use over dark hero backgrounds. */
    variant?: 'primary' | 'outline' | 'white' | 'dark-outline';
    /** If provided, renders as an <a> instead of a <button>. */
    href?: string;
    /** HTML button type. Only applies when `href` is not set. */
    type?: 'button' | 'submit' | 'reset';
    /** Additional classes merged onto the base + variant classes. */
    class?: string;
    /** Click handler. Only applies when `href` is not set. */
    onclick?: () => void;
    /** Disabled state — only applies when rendered as a button. */
    disabled?: boolean;
    children?: Snippet;
  }

  let {
    variant = 'primary',
    href,
    type = 'button',
    class: extraClass = '',
    onclick,
    disabled = false,
    children
  }: Props = $props();

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0';

  const variantClasses: Record<string, string> = {
    primary:
      'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground active:opacity-90',
    white:
      'bg-card text-card-foreground shadow-md hover:bg-muted hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    'dark-outline':
      'border-2 border-card text-card bg-transparent hover:bg-card hover:text-foreground active:opacity-90'
  };

  const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${extraClass}`);
</script>

{#if href}
  <a {href} class={classes}>
    {@render children?.()}
  </a>
{:else}
  <button {type} class={classes} {onclick} {disabled}>
    {@render children?.()}
  </button>
{/if}
