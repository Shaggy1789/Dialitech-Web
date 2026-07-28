<template>
  <div class="settings-page">
    <h1 class="title">Settings</h1>
    <div class="grid">
      <div class="card">
        <h2>General</h2>
        <form class="form">
          <label>
            Theme:
            <select class="select">
              <option>Light</option>
              <option selected>Dark</option>
            </select>
          </label>
          <label>
            Language:
            <select class="select">
              <option selected>Español</option>
              <option>English</option>
            </select>
          </label>
        </form>
      </div>

      <div class="card">
        <h2>Notifications</h2>
        <div class="switch-container">
          <label class="switch">
            <input type="checkbox" />
            <span class="slider"></span>
          </label>
          <span>Critical alerts via email</span>
        </div>
        <div class="switch-container">
          <label class="switch">
            <input type="checkbox" />
            <span class="slider"></span>
          </label>
          <span>Daily summary</span>
        </div>
      </div>

      <div class="card">
        <h2>Data Export</h2>
        <p class="prompt">Export patient data as CSV:</p>
        <a href="#" class="button">Export Sample CSV</a>
      </div>
    </div>

    <div class="card actions">
      <button class="save-btn">Save Changes</button>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.settings-page {
  padding: 1rem;
}
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  background: #fafafa;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}
.select {
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 3px;
}
.switch-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}
.switch input:checked + .slider {
  background-color: #2c3e50;
}
.actions {
  margin-top: 2rem;
  text-align: center;
}
.save-btn {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.5rem 2rem;
  border-radius: 4px;
  cursor: pointer;
}
.save-btn:hover {
  background: #1a252f;
}
</style>