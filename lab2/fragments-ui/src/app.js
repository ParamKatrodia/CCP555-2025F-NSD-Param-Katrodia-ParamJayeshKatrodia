import { signIn, signOut, getUser } from './auth.js';
import { createFragment } from './api.js';

async function init() {
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const sendBtn = document.querySelector('#sendFragment');
  const result = document.querySelector('#result');

  loginBtn.onclick = () => signIn();
  logoutBtn.onclick = () => signOut();

  const user = await getUser();
  if (!user) return;

  // Show greeting
  userSection.hidden = false;
  document.querySelector('#username').innerText = user.username || user.email || 'User';

  sendBtn.addEventListener('click', async () => {
    const text = document.getElementById('fragmentText').value.trim();
    if (!text) {
      result.textContent = '⚠️ Please enter text.';
      return;
    }

    try {
      const fragment = await createFragment(text);
      result.textContent = `✅ Fragment Created! ID: ${fragment.fragment.id}`;
    } catch (err) {
      result.textContent = `❌ ${err.message}`;
      console.error(err);
    }
  });
}

addEventListener('DOMContentLoaded', init);
