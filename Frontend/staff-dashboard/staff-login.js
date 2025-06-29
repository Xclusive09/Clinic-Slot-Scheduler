// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('loginForm');
//   const errorMsg = document.getElementById('errorMsg');

//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     errorMsg.classList.add('hidden');

//     const username = form.username.value.trim();
//     const password = form.password.value.trim();

//     try {
//       const response = await fetch('/api/staff/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });

//       if (!response.ok) throw new Error('Invalid login credentials');

//       const result = await response.json();
//       localStorage.setItem('jwt', result.token);
//       window.location.href = 'dashboard.html';
//     } catch (error) {
//       errorMsg.textContent = error.message;
//       errorMsg.classList.remove('hidden');
//     }
//   });
// });

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorMsg = document.getElementById('errorMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.classList.add('hidden');

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    // Simulated login: accept anything
    if (username && password) {
      const fakeToken = "fake-jwt-token-for-demo";
      localStorage.setItem('jwt', fakeToken);
      window.location.href = 'dashboard.html';
    } else {
      errorMsg.textContent = 'Invalid credentials.';
      errorMsg.classList.remove('hidden');
    }
  });
});

