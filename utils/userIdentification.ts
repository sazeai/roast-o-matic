export function getUserId(): string {
  if (typeof window === 'undefined') {
    return 'server-side'
  }

  let storedId = localStorage.getItem('roast_user_id')
  if (!storedId) {
    storedId = generateBrowserFingerprint()
    localStorage.setItem('roast_user_id', storedId)
  }
  return storedId
}

function generateBrowserFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'fallback-id';

  // Draw some text with a specific font and color
  ctx.font = '12px Arial';
  ctx.fillText('Roast-O-Matic Fingerprint', 0, 10);

  // Add browser-specific information
  const browserInfo = `${navigator.userAgent}${navigator.language}${screen.colorDepth}${screen.pixelDepth}`;
  ctx.fillText(browserInfo, 0, 20);

  // Generate a hash from the canvas data
  const canvasData = canvas.toDataURL();
  let hash = 0;
  for (let i = 0; i < canvasData.length; i++) {
    const char = canvasData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return hash.toString(36); // Convert to base36 for shorter string
}

export function getLastRoastDate(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem('last_roast_date')
}

export function setLastRoastDate(date: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('last_roast_date', date)
  }
}

