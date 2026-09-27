// ============================================================
// TEST PAGE - DEBUG
// ============================================================

export function TestPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'red', fontSize: '32px' }}>✅ वेबसाइट चल रही है!</h1>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>
        अगर आप यह message देख रहे हैं, तो React और routing काम कर रहे हैं।
      </p>
      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>System Status:</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>✅ React loaded</li>
          <li>✅ Router working</li>
          <li>✅ Components rendering</li>
          <li>✅ Build successful</li>
        </ul>
      </div>
      <a href="#/" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: '#dc2626', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
        होमपेज पर जाएं →
      </a>
    </div>
  );
}
