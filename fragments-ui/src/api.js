// src/api.js
const API_URL = "http://ec2-3-91-79-129.compute-1.amazonaws.com:8080";


import { getAccessToken } from "./auth.js";

export async function createFragment(content) {
  const token = await getAccessToken();

  const res = await fetch(`${API_URL}/v1/fragments`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: content,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  }

  const data = await res.json();
  console.log("✅ Fragment created:", data);
  return data;
}
