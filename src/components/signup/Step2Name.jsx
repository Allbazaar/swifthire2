import { useState } from "react"
import Input from "../input"
import Button from "../button"

export default function Step2Name({ formData, updateFormData, onNext, onBack }) {
  const [error, setError] = useState("")

  const handleNext = () => {
    if (!formData.firstName) return setError("Please enter your first name")
    if (!formData.lastName) return setError("Please enter your last name")
    setError("")
    onNext()
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1A3C6E", margin: "0 0 6px" }}>
          Your name
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          How should organisations address you?
        </p>
      </div>

      <Input
        label="First name"
        placeholder="Kofi"
        value={formData.firstName}
        onChange={(e) => updateFormData({ firstName: e.target.value })}
      />

      <Input
        label="Last name"
        placeholder="Mensah"
        value={formData.lastName}
        onChange={(e) => updateFormData({ lastName: e.target.value })}
      />

      <Input
        label="Middle name"
        placeholder="Optional"
        optional
        value={formData.middleName}
        onChange={(e) => updateFormData({ middleName: e.target.value })}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E", display: "flex", justifyContent: "space-between" }}>
          WhatsApp number
          <span style={{ color: "#9CA3AF", fontWeight: "400" }}>Optional</span>
        </label>
        <input
          type="tel"
          placeholder="+233 24 000 0000"
          value={formData.phone || ""}
          onChange={(e) => updateFormData({ phone: e.target.value })}
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
        <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
          Shared only when you are hired for a role
        </span>
      </div>

      {error && (
        <p style={{ fontSize: "12px", color: "#C0392B", margin: 0 }}>{error}</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Button fullWidth variant="primary" onClick={handleNext}>Continue</Button>
        <Button fullWidth variant="ghost" onClick={onBack}>Back</Button>
      </div>
    </div>
  )
}