<!--
  FormField — Spif.io shared primitive
  A labeled input / textarea / select with consistent styling and required-field handling.

  Adapted from the Dream Garage original. Uses design tokens (`foreground`, `border`,
  `card`, `muted-foreground`, `primary`, `destructive`) instead of hardcoded `dg-*` classes
  so it renders in each consuming site's theme.
-->
<script lang="ts">
  interface SelectOption {
    value: string;
    label: string;
  }

  interface Props {
    /** Visible label shown above the field. */
    label: string;
    /** HTML id — also used as the name attribute on the form control. */
    id: string;
    /** HTML input type, plus `textarea` and `select` specials. */
    type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'number' | 'date' | 'textarea' | 'select';
    placeholder?: string;
    required?: boolean;
    /** Two-way bound value. */
    value?: string;
    /** Only used when `type="textarea"`. */
    rows?: number;
    /** Only used when `type="select"`. */
    options?: SelectOption[];
    /** Additional wrapper classes. */
    class?: string;
    /** Optional error message — rendered below the field in destructive color. */
    error?: string;
  }

  let {
    label,
    id,
    type = 'text',
    placeholder = '',
    required = false,
    value = $bindable(''),
    rows = 4,
    options = [],
    class: extraClass = '',
    error = ''
  }: Props = $props();

  const inputBase =
    'w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 hover:border-muted-foreground/50';
</script>

<div class="flex flex-col gap-1.5 {extraClass}">
  <label for={id} class="text-sm font-semibold text-foreground">
    {label}
    {#if required}
      <span class="text-destructive">*</span>
    {/if}
  </label>

  {#if type === 'textarea'}
    <textarea
      {id}
      name={id}
      {placeholder}
      {required}
      {rows}
      bind:value
      class="{inputBase} resize-none"
    ></textarea>
  {:else if type === 'select' && options.length > 0}
    <select {id} name={id} {required} bind:value class="{inputBase} appearance-none cursor-pointer">
      <option value="" disabled selected>{placeholder || 'Select an option'}</option>
      {#each options as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  {:else}
    <input
      {id}
      name={id}
      {type}
      {placeholder}
      {required}
      bind:value
      class={inputBase}
    />
  {/if}

  {#if error}
    <p class="text-xs text-destructive mt-0.5">{error}</p>
  {/if}
</div>
