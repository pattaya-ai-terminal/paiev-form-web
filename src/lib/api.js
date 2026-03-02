const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.205:5002';

export async function login({ identify, password, remember }) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ identify, password, remember })
  });

  if (!response.ok) {
    let message = 'เข้าสู่ระบบไม่สำเร็จ';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (_) {
      // ignore json parse errors
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    let message = 'ออกจากระบบไม่สำเร็จ';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (_) {
      // ignore json parse errors
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json().catch(() => ({}));
}

export async function submitSurvey(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/surveys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = 'ส่งแบบฟอร์มไม่สำเร็จ';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (_) {
      // ignore json parse errors
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json().catch(() => ({}));
}

export async function getSurveys() {
  const response = await fetch(`${API_BASE_URL}/api/v1/surveys`, {
    method: 'GET'
  });

  if (!response.ok) {
    let message = 'โหลดข้อมูลไม่สำเร็จ';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (_) {
      // ignore json parse errors
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json().catch(() => ([]));
}

export async function getSurvey(id) {
  const response = await fetch(`${API_BASE_URL}/api/v1/surveys/${id}`, {
    method: 'GET'
  });

  if (!response.ok) {
    let message = 'โหลดข้อมูลไม่สำเร็จ';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (_) {
      // ignore json parse errors
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json().catch(() => ({}));
}

export async function createSurvey(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/surveys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = 'สร้างรายการไม่สำเร็จ';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (_) {
      // ignore json parse errors
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json().catch(() => ({}));
}

export async function updateSurvey(id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/surveys/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = 'อัปเดตรายการไม่สำเร็จ';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (_) {
      // ignore json parse errors
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json().catch(() => ({}));
}

export async function deleteSurvey(id) {
  const response = await fetch(`${API_BASE_URL}/api/v1/surveys/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    let message = 'ลบรายการไม่สำเร็จ';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (_) {
      // ignore json parse errors
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json().catch(() => ({}));
}

export function persistToken(token, remember) {
  if (!token) return;
  localStorage.setItem('paiev_token', token);
  const maxAge = remember ? 60 * 60 * 24 * 30 : undefined;
  const cookieParts = [
    `paiev_token=${encodeURIComponent(token)}`,
    'path=/',
    'SameSite=Lax'
  ];
  if (maxAge) cookieParts.push(`Max-Age=${maxAge}`);
  document.cookie = cookieParts.join('; ');
}

export function clearToken() {
  localStorage.removeItem('paiev_token');
  sessionStorage.removeItem('paiev_token');
  document.cookie = 'paiev_token=; Max-Age=0; path=/; SameSite=Lax';
}

export function getToken() {
  return localStorage.getItem('paiev_token') || sessionStorage.getItem('paiev_token');
}
