import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Button from "../components/button"

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validSession, setValidSession] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true)
      }
    })
  }, [])

  const handleReset = async () => {
    if (!password) return setError("Please enter a new password")
    if (password.length < 6) return setError("Password must be at least 6 characters")
    if (password !== confirmPassword) return setError("Passwords do not match")

    setLoading(true)
    setError("")

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    if (updateError) {
      setError("Failed to reset password. Please try again or request a new link.")
    } else {
      setSuccess(true)
      setTimeout(() => navigate("/signin"), 3000)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#FAF9F7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "24px",
        textAlign: "center",
        gap: "16px",
      }}>
        <div style={{ fontSize: "48px" }}>✅</div>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1A3C6E", margin: 0 }}>
          Password updated
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          Redirecting you to sign in...
        </p>
      </div>
    )
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
      }}>
        <div style={{
          background: "#1A3C6E",
          color: "#fff",
          padding: "6px 16px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: "600",
          display: "inline-block",
        }}>
          SwiftHire
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1A3C6E",
              margin: "0 0 6px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}>
              Set new password
            </h2>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
              Choose a strong password for your account
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>
              New password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "12px 44px 12px 14px",
                  borderRadius: "8px",
                  border: "1.5px solid #E5E7EB",
                  fontSize: "14px",
                  outline: "none",
                  background: "#fff",
                  color: "#1C1C1E",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#6B7280",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>
              Confirm new password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1.5px solid #E5E7EB",
                fontSize: "14px",
                outline: "none",
                background: "#fff",
                color: "#1C1C1E",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: "12px", color: "#C0392B", margin: 0 }}>{error}</p>
          )}

          <Button fullWidth variant="primary" onClick={handleReset} disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </Button>
        </div>
      </div>
    </div>
  )
}