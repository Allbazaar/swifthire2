import { useNavigate } from "react-router-dom"

export default function SignUp() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF9F7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "24px",
      }}
    >
      <h1 style={{ color: "#1A3C6E", marginBottom: "16px" }}>
        Create your account
      </h1>
      <p style={{ color: "#6B7280", marginBottom: "24px" }}>Coming in Module 3</p>
      <button
        onClick={() => navigate("/")}
        style={{
          background: "transparent",
          border: "1.5px solid #1A3C6E",
          color: "#1A3C6E",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        ← Back to welcome
      </button>
    </div>
  )
}
