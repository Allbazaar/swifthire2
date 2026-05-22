import { useState } from "react"
import Input from "../input"
import Button from "../button"

export default function Step3UserType({ formData, updateFormData, onNext, onBack }) {
  const [error, setError] = useState("")

  const handleNext = () => {
    if (!formData.userType) return setError("Please select who you are")

    if (formData.userType === "student") {
      if (!formData.university?.trim()) return setError("Please enter your university")
      if (!formData.programme?.trim()) return setError("Please enter your programme of study")
      if (!formData.academicLevel) return setError("Please select your academic level")
    }

    if (formData.userType === "talent") {
      if (!formData.university?.trim()) return setError("Please enter your university")
      if (!formData.graduationYear?.trim()) return setError("Please enter your graduation year")
      if (!formData.nsStatus) return setError("Please select your NS status")
    }

    if (formData.userType === "organisation") {
      if (!formData.organisationName?.trim()) return setError("Please enter your organisation name")
      if (!formData.organisationType) return setError("Please select your organisation type")
    }

    setError("")
    onNext()
  }

  const typeButton = (type, label, desc) => (
    <div
      key={type}
      role="button"
      tabIndex={0}
      onClick={() => updateFormData({ userType: type })}
      onKeyDown={(e) => e.key === "Enter" && updateFormData({ userType: type })}
      style={{
        padding: "14px 16px",
        borderRadius: "10px",
        border: formData.userType === type ? "2px solid #1A3C6E" : "1.5px solid #E5E7EB",
        background: formData.userType === type ? "#E6F1FB" : "#fff",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: "600", color: "#1A3C6E" }}>{label}</div>
      <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "3px" }}>{desc}</div>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1A3C6E", margin: "0 0 6px" }}>
          Who are you?
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          This helps us show you the right opportunities
        </p>
      </div>

      {typeButton("student", "Student", "Currently enrolled at a Ghanaian university")}
      {typeButton("talent", "Talent / NS Personnel", "Recent graduate or National Service personnel")}
      {typeButton("organisation", "Organisation", "Company, NGO, government agency, or institution")}

      {formData.userType === "student" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Input label="University" placeholder="e.g. University of Ghana" value={formData.university} onChange={(e) => updateFormData({ university: e.target.value })} />
          <Input label="Programme of study" placeholder="e.g. BSc Computer Science" value={formData.programme} onChange={(e) => updateFormData({ programme: e.target.value })} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>Academic level</label>
            <select
              value={formData.academicLevel}
              onChange={(e) => updateFormData({ academicLevel: e.target.value })}
              style={{ padding: "12px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", background: "#fff", color: "#1C1C1E", outline: "none" }}
            >
              <option value="">Select level</option>
              <option value="100">Level 100</option>
              <option value="200">Level 200</option>
              <option value="300">Level 300</option>
              <option value="400">Level 400</option>
              <option value="postgraduate">Postgraduate</option>
            </select>
          </div>
        </div>
      )}

      {formData.userType === "talent" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Input label="University attended" placeholder="e.g. KNUST" value={formData.university} onChange={(e) => updateFormData({ university: e.target.value })} />
          <Input label="Graduation year" placeholder="e.g. 2024" value={formData.graduationYear} onChange={(e) => updateFormData({ graduationYear: e.target.value })} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>NS status</label>
            <select
              value={formData.nsStatus}
              onChange={(e) => updateFormData({ nsStatus: e.target.value })}
              style={{ padding: "12px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", background: "#fff", color: "#1C1C1E", outline: "none" }}
            >
              <option value="">Select status</option>
              <option value="awaiting">Awaiting posting</option>
              <option value="serving">Currently serving</option>
              <option value="completed">Completed NS</option>
            </select>
          </div>
        </div>
      )}

      {formData.userType === "organisation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Input label="Organisation name" placeholder="e.g. GIZ Ghana" value={formData.organisationName} onChange={(e) => updateFormData({ organisationName: e.target.value })} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>Organisation type</label>
            <select
              value={formData.organisationType}
              onChange={(e) => updateFormData({ organisationType: e.target.value })}
              style={{ padding: "12px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", background: "#fff", color: "#1C1C1E", outline: "none" }}
            >
              <option value="">Select type</option>
              <option value="company">Company</option>
              <option value="ngo">NGO</option>
              <option value="university">University</option>
              <option value="government">Government institution</option>
            </select>
          </div>
          <Input label="Brief description" placeholder="What does your organisation do?" value={formData.description} onChange={(e) => updateFormData({ description: e.target.value })} />
        </div>
      )}

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
