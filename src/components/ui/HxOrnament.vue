<template>
  <div class="hx-ornament" role="separator">
    <hr class="hx-rule" />
    <span class="hx-ornament__gem" aria-hidden="true" />
    <hr class="hx-rule" />
  </div>
</template>

<style scoped>
.hx-ornament { display: flex; align-items: center; gap: var(--hx-s-3); }
.hx-ornament .hx-rule { flex: 1; }
.hx-ornament__gem {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--hx-gold);
  transform: rotate(45deg);
}
</style>
