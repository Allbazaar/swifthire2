import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Input from "../components/input"
import Button from "../components/button"

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignIn = async () => {
    if (!email) return setError("Please enter your email")
    if (!password) return setError("Please enter your password")

    setLoading(true)
    setError("")

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      navigate("/dashboard")

    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.")
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

      {/* Header */}
      <div style={{
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
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            color: "#6B7280",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>

      {/* Form */}
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

        <div style={{ marginBottom: "28px" }}>
          <h2 style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#1A3C6E",
            margin: "0 0 6px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}>
            Welcome back
          </h2>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
            Sign in to your SwiftHire account
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
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

          {error && (
            <p style={{ fontSize: "12px", color: "#C0392B", margin: 0 }}>
              {error}
            </p>
          )}

          <Button
            fullWidth
            variant="primary"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#6B7280",
          }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{
                color: "#1A3C6E",
                fontWeight: "500",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign up free
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
