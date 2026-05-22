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
