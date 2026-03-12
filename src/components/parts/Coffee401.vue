<template>
  <div class="coffee-401">
    <div class="locked-coffee-svg">
      <svg width="340" height="240" viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Coffee Cup with Lock -->
        <g class="coffee-cup">
          <!-- Cup Body -->
          <path d="M 100 80 Q 95 140 105 160 Q 120 175 170 175 Q 220 175 235 160 Q 245 140 240 80 Z"
                fill="white" stroke="#ccc" stroke-width="2"/>
          <ellipse cx="170" cy="80" rx="70" ry="12" fill="white" stroke="#ccc" stroke-width="2"/>
          <ellipse cx="170" cy="80" rx="60" ry="10" fill="#c8c0b8"/>
          
          <!-- Handle -->
          <path d="M 240 110 C 270 110 280 140 270 155 C 260 170 240 165 240 155"
                stroke="white" stroke-width="12" fill="none" stroke-linecap="round"/>
          <path d="M 240 110 C 270 110 280 140 270 155 C 260 170 240 165 240 155"
                stroke="#ccc" stroke-width="2" fill="none" stroke-linecap="round"/>
          
          <!-- Lock on Cup -->
          <g transform="translate(170, 120)">
            <!-- Lock Body -->
            <rect x="-15" y="-5" width="30" height="25" rx="3" fill="#ff6b6b" stroke="#cc5555" stroke-width="2"/>
            <!-- Lock Shackle -->
            <path d="M -10 -5 Q -10 -15, 0 -15 Q 10 -15, 10 -5" 
                  stroke="#ff6b6b" stroke-width="3" fill="none" stroke-linecap="round"/>
            <!-- Keyhole -->
            <circle cx="0" cy="8" r="3" fill="#cc5555"/>
            <rect x="-1.5" cy="8" width="3" height="6" fill="#cc5555"/>
          </g>
        </g>
        
        <!-- Steam/Access Denied Lines -->
        <g class="denied-lines">
          <path d="M 150 60 L 150 40" stroke="#ff6b6b" stroke-width="2" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
          </path>
          <path d="M 170 60 L 170 35" stroke="#ff6b6b" stroke-width="2" opacity="0.6">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite"/>
          </path>
          <path d="M 190 60 L 190 40" stroke="#ff6b6b" stroke-width="2" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
          </path>
        </g>
        
        <!-- Coffee Beans (locked away) -->
        <g class="coffee-beans">
          <ellipse cx="120" cy="200" rx="8" ry="12" fill="#5c2200" opacity="0.3" transform="rotate(25 120 200)"/>
          <ellipse cx="170" cy="205" rx="8" ry="12" fill="#5c2200" opacity="0.3" transform="rotate(-15 170 205)"/>
          <ellipse cx="220" cy="200" rx="8" ry="12" fill="#5c2200" opacity="0.3" transform="rotate(45 220 200)"/>
        </g>
      </svg>
    </div>
    
    <div class="error-content">
      <h1 class="error-code">401</h1>
      <h2 class="error-title">Coffee Access Denied!</h2>
      <p class="error-message">
        Your coffee session has expired. Please log in again to enjoy your favorite brews.
      </p>
      <button @click="goToLogin" class="login-btn">
        <span class="login-icon">🔓</span>
        Login to Continue
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Coffee401',
  methods: {
    goToLogin() {
      const authOrigin = 'http://localhost:4170';
      const returnTo = `${window.location.origin}${window.location.pathname}`;
      const loginUrl = new URL('/login', authOrigin);
      loginUrl.searchParams.set('returnTo', returnTo);
      window.location.assign(loginUrl.toString());
    }
  }
});
</script>

<style scoped>
.coffee-401 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
}

.locked-coffee-svg {
  margin-bottom: 2rem;
}

.coffee-cup {
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.error-content {
  max-width: 400px;
}

.error-code {
  font-size: 4rem;
  font-weight: bold;
  color: #ff6b6b;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.error-title {
  font-size: 2rem;
  color: #ff6b6b;
  margin: 0.5rem 0;
  font-weight: 600;
}

.error-message {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 1rem 0;
}

.login-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
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
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.login-icon {
  font-size: 1.2rem;
}

@media (max-width: 480px) {
  .error-code {
    font-size: 3rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .locked-coffee-svg svg {
    width: 280px !important;
    height: 200px !important;
  }
}
</style>
