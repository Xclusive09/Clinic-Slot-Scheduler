document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorMsg = document.getElementById('errorMsg');
  const spinner = document.getElementById('spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.classList.add('hidden');
    spinner.classList.remove('hidden');

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    try {
      const response = await fetch('https://clinic-slot-scheduler.onrender.com/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      spinner.classList.add('hidden');

      if (!response.ok) {
        errorMsg.textContent = result.error || 'Invalid login credentials';
        errorMsg.classList.remove('hidden');
        return;
      }

      localStorage.setItem('jwt', result.token);
      window.location.href = 'dashboard.html';
    } catch (error) {
      spinner.classList.add('hidden');
      errorMsg.textContent = 'Network error. Please try again.';
      errorMsg.classList.remove('hidden');
    }
  });
});