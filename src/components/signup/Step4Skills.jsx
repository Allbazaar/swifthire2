import { useState } from "react"
import Button from "../button"

const SKILLS = [
  "Research", "Python", "Design", "Writing", "Excel",
  "Finance", "Marketing", "Engineering", "Data Analysis",
  "Project Management", "Communication", "Accounting",
  "Legal", "Healthcare", "Education", "Agriculture",
]

export default function Step4Skills({ formData, updateFormData, onNext, onBack }) {
  const [error, setError] = useState("")
  const isOrganisation = formData.userType === "organisation"

  const toggleSkill = (skill) => {
    const current = formData.skills || []
    const updated = current.includes(skill)
      ? current.filter((s) => s !== skill)
      : [...current, skill]
    updateFormData({ skills: updated })
  }

  const handleNext = () => {
    if (isOrganisation) {
      setError("")
      onNext()
      return
    }
    if (!formData.skills?.length) {
      return setError("Please select at least one skill")
    }
    if (!formData.availableFrom) {
      return setError("Please select when you are available from")
    }
    setError("")
    onNext()
  }

  if (isOrganisation) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1A3C6E", margin: "0 0 6px" }}>
            Ready to verify
          </h2>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
            Organisation accounts skip skills — continue to review and create your account.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Button fullWidth variant="primary" onClick={handleNext}>Continue</Button>
          <Button fullWidth variant="ghost" onClick={onBack}>Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1A3C6E", margin: "0 0 6px" }}>
          Your skills
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          Select all that apply — this helps match you to the right opportunities
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {SKILLS.map((skill) => (
          <div
            key={skill}
            role="button"
            tabIndex={0}
            onClick={() => toggleSkill(skill)}
            onKeyDown={(e) => e.key === "Enter" && toggleSkill(skill)}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              border: formData.skills?.includes(skill) ? "2px solid #1A3C6E" : "1.5px solid #E5E7EB",
              background: formData.skills?.includes(skill) ? "#E6F1FB" : "#fff",
              color: formData.skills?.includes(skill) ? "#1A3C6E" : "#6B7280",
              fontSize: "12px",
              fontWeight: formData.skills?.includes(skill) ? "500" : "400",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {skill}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>
          Available from
        </label>
        <input
          type="date"
          value={formData.availableFrom}
          onChange={(e) => updateFormData({ availableFrom: e.target.value })}
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

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Button fullWidth variant="primary" onClick={handleNext}>Continue</Button>
        <Button fullWidth variant="ghost" onClick={onBack}>Back</Button>
      </div>
    </div>
  )
}
