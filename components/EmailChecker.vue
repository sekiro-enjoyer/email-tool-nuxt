<template>
    <div class="email-checker">
      <input v-model="email" placeholder="Enter email" />
      <button @click="checkEmail" :disabled="loading">Check Email</button>
      <p v-if="loading">Checking...</p>
      <p v-if="error" style="color: red;">{{ error }}</p>
      <div v-if="result">
        <p><strong>Valid Syntax:</strong> {{ result.validSyntax }}</p>
        <p><strong>Domain Exists:</strong> {{ result.domainExists }}</p>
        <p><strong>Disposable Email:</strong> {{ result.isDisposable }}</p>
        <p><strong>MX Records Found:</strong> {{ result.mxRecordsFound }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const email = ref('');
  const result = ref(null);
  const loading = ref(false);
  const error = ref('');
  
  async function checkEmail() {
    loading.value = true;
    result.value = null;
    error.value = '';
  
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value })
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error checking email');
  
      result.value = data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }
  </script>
  
  <style scoped>
  .email-checker {
    text-align: center;
    margin: 20px;
  }
  </style>
  ''