<template>
  <div class="email-checker-container">
    <h1>Email Checker</h1>
    <input v-model="email" type="text" placeholder="Enter Email" class="email-input" />
    <button class="check-btn" @click="checkEmail">Check Email</button>

    <div v-if="result">
      <p><strong>Valid Syntax:</strong> {{ result.validSyntax }}</p>
      <p><strong>Domain Exists:</strong> {{ result.domainExists }}</p>
      <p><strong>Disposable Email:</strong> {{ result.isDisposable }}</p>
      <p><strong>MX Records Found:</strong> {{ result.mxRecordsFound }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const result = ref(null);

const checkEmail = async () => {
  if (!email.value) {
    alert("Please enter an email.");
    return;
  }

  try {
    const response = await fetch('/api/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.value })
    });
    result.value = await response.json();
  } catch (error) {
    console.error("Error checking email:", error);
  }
};
</script>

<style scoped>
.email-checker-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #766be9; /* Darker cyan */
}

.email-input {
  width: 300px;
  height: 40px;
  font-size: 16px;
  padding: 8px;
  border: 1px solid #898888;
  border-radius: 5px;
  margin-bottom: 10px;
}

.check-btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
}

.check-btn:hover {
  background-color: #af1527;
}
</style>
