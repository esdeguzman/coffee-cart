<template>
  <li class="skeleton-card">
    <div class="skeleton-cup-wrapper">
      <div class="skeleton-cup"></div>
    </div>
    <div class="skeleton-text">
      <div class="skeleton-line -name"></div>
      <div class="skeleton-line -price"></div>
    </div>
  </li>
</template>

<style scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.skeleton-cup-wrapper {
  width: 200px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.skeleton-cup {
  width: 180px;
  height: 160px;
  background-color: #e0e0e0;
  border-radius: 10px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-text {
  width: 200px;
  margin-top: 10px;
}

.skeleton-line {
  height: 1em;
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-line.-name {
  width: 80%;
  margin-bottom: 5px;
}

.skeleton-line.-price {
  width: 50%;
}

@keyframes pulse {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #f0f0f0;
  }
  100% {
    background-color: #e0e0e0;
  }
}
</style>
