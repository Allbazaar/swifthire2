import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import Button from "../button"

export default function Step5Verify({ formData, onBack }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleCreateAccount = async () => {
    setLoading(true)
    setError("")

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (signUpError) throw signUpError

      const user = data?.user

      if (!user) {
        setSuccess(true)
        setLoading(false)
        return
      }

      const userId = user.id

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          user_type: formData.userType,
          first_name: formData.firstName,
          last_name: formData.lastName,
          middle_name: formData.middleName || null,
          is_verified: formData.email.endsWith(".edu.gh"),
        })

      if (profileError) {
        console.error("Profile error:", profileError.message)
      }

      if (formData.userType === "student" || formData.userType === "talent") {
        const { error: studentError } = await supabase
          .from("student_profiles")
          .upsert({
            id: userId,
            university: formData.university || null,
            programme: formData.programme || null,
            academic_level: formData.academicLevel || null,
            skills: formData.skills || [],
            available_from: formData.availableFrom || null,
          })

        if (studentError) {
          console.error("Student profile error:", studentError.message)
        }
      }

      if (formData.userType === "organisation") {
        const { error: orgError } = await supabase
          .from("organisation_profiles")
          .upsert({
            id: userId,
            organisation_name: formData.organisationName || null,
            organisation_type: formData.organisationType || null,
            description: formData.description || null,
          })

        if (orgError) {
          console.error("Org profile error:", orgError.message)
        }
      }

      setSuccess(true)

    } catch (err) {
      console.error("Error creating account:", err.message)
      if (err.message?.includes("already registered")) {
        setError("An account with this email already exists. Please sign in instead.")
      } else {
        setError(err.message || "Failed to create account. Please try again.")
      }
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center", paddingTop: "40px" }}>
        <div style={{ fontSize: "48px" }}>🎉</div>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1A3C6E", margin: 0 }}>
          You are in
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", maxWidth: "300px", margin: 0, lineHeight: "1.6" }}>
          Your SwiftHire account has been created successfully.
        </p>
        <div style={{ background: "#E1F5EE", borderRadius: "10px", padding: "12px 20px", fontSize: "13px", color: "#0F6E56", fontWeight: "500" }}>
          ✓ Account created successfully
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#1A3C6E",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Go to my dashboard
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1A3C6E", margin: "0 0 6px" }}>
          Almost there
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          Review your details and create your account
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: "0.5px solid #F3F4F6", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#6B7280" }}>Email</span>
          <span style={{ fontSize: "12px", color: "#1C1C1E", fontWeight: "500" }}>{formData.email}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#6B7280" }}>Name</span>
          <span style={{ fontSize: "12px", color: "#1C1C1E", fontWeight: "500" }}>{formData.firstName} {formData.lastName}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#6B7280" }}>Account type</span>
          <span style={{ fontSize: "12px", color: "#1A3C6E", fontWeight: "500", textTransform: "capitalize" }}>{formData.userType}</span>
        </div>
        {formData.skills?.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>Skills</span>
            <span style={{ fontSize: "12px", color: "#1C1C1E", fontWeight: "500" }}>{formData.skills.length} selected</span>
          </div>
        )}
        {formData.email.endsWith(".edu.gh") && (
          <div style={{ background: "#E1F5EE", borderRadius: "6px", padding: "8px 10px", fontSize: "11px", color: "#0F6E56", fontWeight: "500" }}>
            ✓ University email detected — you will be auto-verified as a student
          </div>
        )}
      </div>

      {error && (
        <p style={{ fontSize: "12px", color: "#C0392B", margin: 0 }}>{error}</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Button fullWidth variant="primary" onClick={handleCreateAccount} disabled={loading}>
          {loading ? "Creating your account..." : "Create my account"}
        </Button>
        <Button fullWidth variant="ghost" onClick={onBack}>Back</Button>
      </div>
    </div>
  )
}