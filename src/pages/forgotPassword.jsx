import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Input from "../components/input"
import Button from "../components/button"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSend = async () => {
    if (!email) return setError("Please enter your email address")
    setLoading(true)
    setError("")

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password` }
    )

    if (resetError) {
      setError("Something went wrong. Please try again.")
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAF9F7",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Inter, sans-serif",
    }}>

      <nav style={{
        background: "#fff",
        borderBottom: "0.5px solid #F3F4F6",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{
          background: "#1A3C6E",
          color: "#fff",
          padding: "6px 16px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: "600",
        }}>
          SwiftHire
        </div>
        <button
          onClick={() => navigate("/signin")}
          style={{
            background: "transparent",
            border: "none",
            color: "#6B7280",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          ← Sign in
        </button>
      </nav>

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "24px",
        maxWidth: "480px",
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>

        {sent ? (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
            <div style={{ fontSize: "48px" }}>📧</div>
            <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1A3C6E", margin: 0 }}>
              Check your email
            </h2>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0, maxWidth: "300px", lineHeight: "1.6" }}>
              We sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
            </p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
              Did not receive it? Check your spam folder.
            </p>
            <Button variant="ghost" onClick={() => setSent(false)}>
              Try a different email
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#1A3C6E",
                margin: "0 0 6px",
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}>
                Reset your password
              </h2>
              <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
                Enter your email and we will send you a reset link
              </p>
            </div>

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && (
              <p style={{ fontSize: "12px", color: "#C0392B", margin: 0 }}>{error}</p>
            )}

            <Button fullWidth variant="primary" onClick={handleSend} disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>

            <div style={{ textAlign: "center", fontSize: "13px", color: "#6B7280" }}>
              Remember your password?{" "}
              <span
                onClick={() => navigate("/signin")}
                style={{ color: "#1A3C6E", fontWeight: "500", cursor: "pointer", textDecoration: "underline" }}
              >
                Sign in
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}