<template>
  <div class="coffee-404">
    <div class="spilled-coffee-svg">
      <svg width="340" height="240" viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Puddle (animates) -->
        <g class="puddle">
          <path d="
            M 170 112
            C 130 100, 60 105, 30 125
            C 8 140, 14 168, 50 182
            C 82 194, 128 200, 170 200
            C 212 200, 258 194, 290 182
            C 326 168, 332 140, 310 125
            C 280 105, 210 100, 170 112 Z
          " fill="#5c2200"/>
          <path d="
            M 110 128
            C 118 108, 140 100, 158 106
            C 170 110, 176 120, 172 132
            C 165 118, 150 112, 136 116
            C 124 119, 114 126, 110 128 Z
          " fill="#5c2200"/>
        </g>

        <!-- Cup — static, always visible -->
        <g transform="translate(178, 148) rotate(-105) translate(-45, -50)">
          <path d="M 8 12 Q 5 65 10 78 Q 20 88 45 88 Q 70 88 80 78 Q 85 65 82 12 Z"
                fill="white" stroke="#ccc" stroke-width="2"/>
          <ellipse cx="45" cy="12" rx="37" ry="8" fill="white" stroke="#ccc" stroke-width="2"/>
          <ellipse cx="45" cy="12" rx="30" ry="6.5" fill="#c8c0b8"/>
          <path d="M 80 30 C 106 30 112 58 106 70 C 100 80 82 79 80 74"
                stroke="white" stroke-width="11" fill="none" stroke-linecap="round"/>
          <path d="M 80 30 C 106 30 112 58 106 70 C 100 80 82 79 80 74"
                stroke="#ccc" stroke-width="2" fill="none" stroke-linecap="round"/>
        </g>
      </svg>
    </div>
    
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Oh no what a mess!</h2>
      <p class="error-message">
        Someone spilled the coffee, but at least it smells good.
      </p>
      <button @click="refreshData" class="refresh-btn">
        <span class="refresh-icon">↻</span>
        Brew Some Coffee
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Coffee404',
  methods: {
    refreshData() {
      window.location.href = '/?wait=3000';
    }
  }
});
</script>

<style scoped>
.coffee-404 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
}

.spilled-coffee-svg {
  margin-bottom: 2rem;
  transform-origin: 170px 160px;
}

.puddle {
  transform-origin: 170px 160px;
  animation: expand 3s cubic-bezier(0.34, 1.05, 0.64, 1) forwards;
  transform: scale(0);
}

@keyframes expand {
  0%   { transform: scale(0); }
  100% { transform: scale(1); }
}

.error-content {
  max-width: 400px;
}

.error-code {
  font-size: 4rem;
  font-weight: bold;
  color: #5c2200;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.error-title {
  font-size: 2rem;
  color: #5c2200;
  margin: 0.5rem 0;
  font-weight: 600;
}

.error-message {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 1rem 0;
}

.refresh-btn {
  background: linear-gradient(135deg, #5c2200 0%, #8d6e63 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(92, 34, 0, 0.3);
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(92, 34, 0, 0.4);
}

.refresh-icon {
  font-size: 1.2rem;
  animation: rotate 2s linear infinite;
}

.refresh-btn:hover .refresh-icon {
  animation-duration: 1s;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 3rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .spilled-coffee-svg svg {
    width: 280px !important;
    height: 200px !important;
  }
}
</style>
