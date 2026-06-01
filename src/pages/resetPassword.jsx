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
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const handleToken = async () => {
      const hashParams = new URLSearchParams(
        window.location.hash.substring(1)
      )
      const accessToken = hashParams.get("access_token")
      const refreshToken = hashParams.get("refresh_token")
      const type = hashParams.get("type")
  
      if (type === "recovery" && accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
  
        if (error || !data.session) {
          setError("This reset link has expired. Please request a new one.")
        } else {
          setReady(true)
        }
      } else {
        setError("Invalid or expired reset link. Please request a new one.")
      }
  
      setChecking(false)
    }
  
    handleToken()
  }, [])
  
  const handleReset = async () => {
    if (!password) return setError("Please enter a new password")
    if (password.length < 6) return setError("Password must be at least 6 characters")
    if (password !== confirmPassword) return setError("Passwords do not match")
  
    setLoading(true)
    setError("")
  
    const { data: { session } } = await supabase.auth.getSession()
  
    if (!session) {
      setError("Your session has expired. Please request a new reset link.")
      setLoading(false)
      return
    }
  
    const { error: updateError } = await supabase.auth.updateUser({ password })
  
    if (updateError) {
      console.error("Update error:", updateError)
      setError(`Failed to update: ${updateError.message}`)
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

  if (checking) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#FAF9F7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
      }}>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>Verifying your reset link...</p>
      </div>
    )
  }

  if (error && !ready) {
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
        <div style={{ fontSize: "48px" }}>⚠️</div>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1A3C6E", margin: 0 }}>
          Link expired
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>{error}</p>
        <Button variant="primary" onClick={() => navigate("/forgot-password")}>
          Request new link
        </Button>
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