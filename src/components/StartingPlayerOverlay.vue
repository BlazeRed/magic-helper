<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="visible" class="spo-backdrop">
        <div class="spo-content">
          <svg
            id="card-shuffle-anim"
            class="shuffle-svg"
            viewBox="0 0 200 148"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Shuffling deck of cards"
          >
            <defs>
              <filter id="csa-shadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity="0.75"/>
              </filter>
              <filter id="csa-gem-glow" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!--
              All 7 cards share the same pivot: SVG point (100, 122).
              Each card rect: x=-22 y=-66 w=44 h=66  →  bottom-center = (0,0) in group space.
              Draw order back→front: c1, c7, c2, c6, c3, c5, c4
              so the center card (c4, 0 deg) sits on top when stacked.
            -->
            <g transform="translate(100, 122)">

              <!-- c1 · leftmost · –27 ° -->
              <g class="csa-cg csa-c1" filter="url(#csa-shadow)">
                <rect x="-22" y="-66" width="44" height="66" rx="5" fill="#0d1040" stroke="#c9a84c" stroke-width="1.5"/>
                <rect x="-18" y="-62" width="36" height="58" rx="3" fill="none" stroke="#c9a84c" stroke-width="0.6" opacity="0.75"/>
                <polygon points="0,-47 9,-37 0,-27 -9,-37" fill="#141855" stroke="#c9a84c" stroke-width="0.9"/>
                <circle cx="0" cy="-37" r="3.5" fill="#e53935" filter="url(#csa-gem-glow)"/>
                <polygon points="-14,-59 -11,-55 -14,-51 -17,-55" fill="#c9a84c" opacity="0.6"/>
                <polygon points="14,-7 17,-11 14,-15 11,-11"     fill="#c9a84c" opacity="0.6"/>
              </g>

              <!-- c7 · rightmost · +27 ° -->
              <g class="csa-cg csa-c7" filter="url(#csa-shadow)">
                <rect x="-22" y="-66" width="44" height="66" rx="5" fill="#0d1040" stroke="#c9a84c" stroke-width="1.5"/>
                <rect x="-18" y="-62" width="36" height="58" rx="3" fill="none" stroke="#c9a84c" stroke-width="0.6" opacity="0.75"/>
                <polygon points="0,-47 9,-37 0,-27 -9,-37" fill="#141855" stroke="#c9a84c" stroke-width="0.9"/>
                <circle cx="0" cy="-37" r="3.5" fill="#e53935" filter="url(#csa-gem-glow)"/>
                <polygon points="-14,-59 -11,-55 -14,-51 -17,-55" fill="#c9a84c" opacity="0.6"/>
                <polygon points="14,-7 17,-11 14,-15 11,-11"     fill="#c9a84c" opacity="0.6"/>
              </g>

              <!-- c2 · –18 ° -->
              <g class="csa-cg csa-c2" filter="url(#csa-shadow)">
                <rect x="-22" y="-66" width="44" height="66" rx="5" fill="#0e1142" stroke="#c9a84c" stroke-width="1.5"/>
                <rect x="-18" y="-62" width="36" height="58" rx="3" fill="none" stroke="#c9a84c" stroke-width="0.6" opacity="0.75"/>
                <polygon points="0,-47 9,-37 0,-27 -9,-37" fill="#141855" stroke="#c9a84c" stroke-width="0.9"/>
                <circle cx="0" cy="-37" r="3.5" fill="#e53935" filter="url(#csa-gem-glow)"/>
                <polygon points="-14,-59 -11,-55 -14,-51 -17,-55" fill="#c9a84c" opacity="0.6"/>
                <polygon points="14,-7 17,-11 14,-15 11,-11"     fill="#c9a84c" opacity="0.6"/>
              </g>

              <!-- c6 · +18 ° -->
              <g class="csa-cg csa-c6" filter="url(#csa-shadow)">
                <rect x="-22" y="-66" width="44" height="66" rx="5" fill="#0e1142" stroke="#c9a84c" stroke-width="1.5"/>
                <rect x="-18" y="-62" width="36" height="58" rx="3" fill="none" stroke="#c9a84c" stroke-width="0.6" opacity="0.75"/>
                <polygon points="0,-47 9,-37 0,-27 -9,-37" fill="#141855" stroke="#c9a84c" stroke-width="0.9"/>
                <circle cx="0" cy="-37" r="3.5" fill="#e53935" filter="url(#csa-gem-glow)"/>
                <polygon points="-14,-59 -11,-55 -14,-51 -17,-55" fill="#c9a84c" opacity="0.6"/>
                <polygon points="14,-7 17,-11 14,-15 11,-11"     fill="#c9a84c" opacity="0.6"/>
              </g>

              <!-- c3 · –9 ° -->
              <g class="csa-cg csa-c3" filter="url(#csa-shadow)">
                <rect x="-22" y="-66" width="44" height="66" rx="5" fill="#0f1244" stroke="#c9a84c" stroke-width="1.5"/>
                <rect x="-18" y="-62" width="36" height="58" rx="3" fill="none" stroke="#c9a84c" stroke-width="0.6" opacity="0.75"/>
                <polygon points="0,-47 9,-37 0,-27 -9,-37" fill="#141855" stroke="#c9a84c" stroke-width="0.9"/>
                <circle cx="0" cy="-37" r="3.5" fill="#e53935" filter="url(#csa-gem-glow)"/>
                <polygon points="-14,-59 -11,-55 -14,-51 -17,-55" fill="#c9a84c" opacity="0.6"/>
                <polygon points="14,-7 17,-11 14,-15 11,-11"     fill="#c9a84c" opacity="0.6"/>
              </g>

              <!-- c5 · +9 ° -->
              <g class="csa-cg csa-c5" filter="url(#csa-shadow)">
                <rect x="-22" y="-66" width="44" height="66" rx="5" fill="#0f1244" stroke="#c9a84c" stroke-width="1.5"/>
                <rect x="-18" y="-62" width="36" height="58" rx="3" fill="none" stroke="#c9a84c" stroke-width="0.6" opacity="0.75"/>
                <polygon points="0,-47 9,-37 0,-27 -9,-37" fill="#141855" stroke="#c9a84c" stroke-width="0.9"/>
                <circle cx="0" cy="-37" r="3.5" fill="#e53935" filter="url(#csa-gem-glow)"/>
                <polygon points="-14,-59 -11,-55 -14,-51 -17,-55" fill="#c9a84c" opacity="0.6"/>
                <polygon points="14,-7 17,-11 14,-15 11,-11"     fill="#c9a84c" opacity="0.6"/>
              </g>

              <!-- c4 · center · 0 ° — drawn last = highest z -->
              <g class="csa-cg csa-c4" filter="url(#csa-shadow)">
                <rect x="-22" y="-66" width="44" height="66" rx="5" fill="#101346" stroke="#c9a84c" stroke-width="1.5"/>
                <rect x="-18" y="-62" width="36" height="58" rx="3" fill="none" stroke="#c9a84c" stroke-width="0.6" opacity="0.75"/>
                <polygon points="0,-47 9,-37 0,-27 -9,-37" fill="#141855" stroke="#c9a84c" stroke-width="0.9"/>
                <circle cx="0" cy="-37" r="3.5" fill="#e53935" filter="url(#csa-gem-glow)"/>
                <polygon points="-14,-59 -11,-55 -14,-51 -17,-55" fill="#c9a84c" opacity="0.6"/>
                <polygon points="14,-7 17,-11 14,-15 11,-11"     fill="#c9a84c" opacity="0.6"/>
              </g>

            </g>
          </svg>

          <p class="spo-text">Selecting starting player…</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>()
</script>

/* SVG card animation — non-scoped so rules reach inside the inline SVG */
<style>
#card-shuffle-anim .csa-cg {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: shuffle-fan 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
}
#card-shuffle-anim .csa-c1 { --sf-a: -27deg; animation-delay: -0.30s; }
#card-shuffle-anim .csa-c2 { --sf-a: -18deg; animation-delay: -0.25s; }
#card-shuffle-anim .csa-c3 { --sf-a:  -9deg; animation-delay: -0.20s; }
#card-shuffle-anim .csa-c4 { --sf-a:   0deg; animation-delay: -0.15s; }
#card-shuffle-anim .csa-c5 { --sf-a:   9deg; animation-delay: -0.10s; }
#card-shuffle-anim .csa-c6 { --sf-a:  18deg; animation-delay: -0.05s; }
#card-shuffle-anim .csa-c7 { --sf-a:  27deg; animation-delay:  0.00s; }
@keyframes shuffle-fan {
  0%, 10%   { transform: rotate(0deg)        translateY(0px); }
  38%, 62%  { transform: rotate(var(--sf-a)) translateY(-5px); }
  90%, 100% { transform: rotate(0deg)        translateY(0px); }
}
</style>

<style scoped>
.spo-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
}

.spo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.shuffle-svg {
  width: 190px;
  height: 148px;
  overflow: visible;
}

.spo-text {
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.1em;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
