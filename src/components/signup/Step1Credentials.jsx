import { useState } from "react"
import Input from "../input"
import Button from "../button"

const fieldStyle = {
  padding: "12px 44px 12px 14px",
  borderRadius: "8px",
  border: "1.5px solid #E5E7EB",
  fontSize: "14px",
  outline: "none",
  background: "#fff",
  color: "#1C1C1E",
  width: "100%",
  boxSizing: "border-box",
}

function PasswordField({ label, value, onChange, show, onToggleShow }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          style={fieldStyle}
        />
        <button
          type="button"
          onClick={onToggleShow}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "#6B7280",
            fontSize: "12px",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  )
}

export default function Step1Credentials({ formData, updateFormData, onNext }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")

  const handleNext = () => {
    if (!formData.email) return setError("Please enter your email")
    if (!formData.password) return setError("Please enter a password")
    if (formData.password.length < 6) return setError("Password must be at least 6 characters")
    if (!formData.confirmPassword) return setError("Please confirm your password")
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match")
    setError("")
    onNext()
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1A3C6E", margin: "0 0 6px" }}>
          Create your account
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          {"Let's start with your login details"}
        </p>
      </div>

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(e) => updateFormData({ email: e.target.value })}
      />

      <PasswordField
        label="Password"
        value={formData.password}
        onChange={(e) => updateFormData({ password: e.target.value })}
        show={showPassword}
        onToggleShow={() => setShowPassword((v) => !v)}
      />

      <PasswordField
        label="Confirm password"
        value={formData.confirmPassword}
        onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
        show={showConfirm}
        onToggleShow={() => setShowConfirm((v) => !v)}
      />

      {error && (
        <p style={{ fontSize: "12px", color: "#C0392B", margin: 0 }}>{error}</p>
      )}

      <Button fullWidth variant="primary" onClick={handleNext}>
        Continue
      </Button>
    </div>
  )
}
