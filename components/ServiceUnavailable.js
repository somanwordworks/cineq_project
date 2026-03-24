

// components/ServiceUnavailable.jsx
export default function ServiceUnavailable() {
  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        background: "#fff3cd",
        borderRadius: "8px",
        margin: "20px 0",
        border: "1px solid #ffeeba",
      }}
    >
      <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#856404" }}>
        ⚠️ Service Unavailable
      </h2>
      <p style={{ marginTop: "10px", color: "#856404" }}>
        Due to server load, this section is temporarily unavailable. <br />
        We’ll be back soon.
      </p>
    </div>
  );
}
