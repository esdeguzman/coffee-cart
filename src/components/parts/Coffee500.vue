<template>
  <div v-if="error" class="coffee-500">
    <div class="broken-machine-svg">
      <svg width="340" height="240" viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Coffee Machine (broken) -->
        <g class="coffee-machine">
          <!-- Machine Body -->
          <rect x="100" y="40" width="140" height="120" rx="8" fill="#8B4513" stroke="#654321" stroke-width="2"/>
          
          <!-- Top Section -->
          <rect x="110" y="50" width="120" height="40" rx="4" fill="#A0522D"/>
          
          <!-- Display Screen (cracked) -->
          <rect x="120" y="60" width="100" height="20" rx="2" fill="#333" stroke="#654321" stroke-width="1"/>
          <line x1="125" y1="65" x2="145" y2="75" stroke="#ff4444" stroke-width="2"/>
          <line x1="150" y1="62" x2="165" y2="78" stroke="#ff4444" stroke-width="2"/>
          <line x1="170" y1="66" x2="185" y2="74" stroke="#ff4444" stroke-width="2"/>
          <line x1="190" y1="63" x2="210" y2="77" stroke="#ff4444" stroke-width="2"/>
          
          <!-- Coffee Outlet -->
          <rect x="155" y="90" width="30" height="15" fill="#654321"/>
          <circle cx="170" cy="105" r="3" fill="#444"/>
          
          <!-- Drip -->
          <g class="drip">
            <ellipse cx="170" cy="115" rx="2" ry="4" fill="#5c2200">
              <animate attributeName="ry" values="4;8;4" dur="1.5s" repeatCount="indefinite"/>
              <animate attributeName="cy" values="115;125;115" dur="1.5s" repeatCount="indefinite"/>
            </ellipse>
          </g>
          
          <!-- Base -->
          <rect x="90" y="160" width="160" height="20" rx="4" fill="#654321"/>
          
          <!-- Warning Light -->
          <circle cx="240" cy="70" r="8" fill="#ff4444">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        <!-- Steam/Error Lines -->
        <g class="error-lines">
          <path d="M 170 30 Q 165 20, 170 10" stroke="#ff4444" stroke-width="2" fill="none" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite"/>
          </path>
          <path d="M 180 30 Q 185 20, 180 10" stroke="#ff4444" stroke-width="2" fill="none" opacity="0.7">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2s" repeatCount="indefinite"/>
          </path>
        </g>
      </svg>
    </div>
    
    <div class="error-content">
      <h1 class="error-code">500</h1>
      <h2 class="error-title">Coffee Machine Broken!</h2>
      <p class="error-message">
        The coffee machine is on fire! Our engineers are working hard to fix it.
        Please try again later.
      </p>
      <button @click="goHome" class="home-btn">
        <span class="home-icon">🏠</span>
        Back to Main Page
      </button>
    </div>
  </div>
  <div v-else class="no-error">
    <p>No error to display.</p>
    <button @click="goHome" class="home-btn">
      <span class="home-icon">🏠</span>
      Back to Main Page
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Coffee500',
  props: {
    error: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const router = useRouter();
    
    const goHome = () => {
      window.location.href = '/?wait=3000';
    };
    
    return {
      goHome,
      error: props.error
    };
  }
});
</script>

<style scoped>
.coffee-500 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
}

.broken-machine-svg {
  margin-bottom: 2rem;
}

.coffee-machine {
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.error-content {
  max-width: 400px;
}

.error-code {
  font-size: 4rem;
  font-weight: bold;
  color: #ff4444;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.error-title {
  font-size: 2rem;
  color: #ff4444;
  margin: 0.5rem 0;
  font-weight: 600;
}

.error-message {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 1rem 0;
}

.home-btn {
  background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
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
  box-shadow: 0 4px 15px rgba(255, 68, 68, 0.3);
}

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 68, 68, 0.4);
}

.home-icon {
  font-size: 1.2rem;
}

.no-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
}

.no-error p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

@media (max-width: 480px) {
  .error-code {
    font-size: 3rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .broken-machine-svg svg {
    width: 280px !important;
    height: 200px !important;
  }
}
</style>
