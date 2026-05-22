import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import Button from "../button"

export default function Step5Verify({ formData, onBack }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)

  const handleCreateAccount = async () => {
    setLoading(true)
    setError("")

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (signUpError) throw signUpError

      const userId = data.user?.id

      if (!userId) {
        setNeedsEmailConfirmation(true)
        setSuccess(true)
        return
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        user_type: formData.userType,
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName || null,
        is_verified: formData.email.endsWith(".edu.gh"),
      })

      if (profileError) throw profileError

      if (formData.userType === "student" || formData.userType === "talent") {
        const { error: studentError } = await supabase.from("student_profiles").insert({
          id: userId,
          university: formData.university,
          programme: formData.programme || null,
          academic_level: formData.academicLevel || null,
          graduation_year: formData.graduationYear || null,
          ns_status: formData.nsStatus || null,
          skills: formData.skills,
          available_from: formData.availableFrom || null,
        })

        if (studentError) throw studentError
      }

      if (formData.userType === "organisation") {
        const { error: orgError } = await supabase.from("organisation_profiles").insert({
          id: userId,
          organisation_name: formData.organisationName,
          organisation_type: formData.organisationType,
          description: formData.description || null,
        })

        if (orgError) throw orgError
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center", paddingTop: "40px" }}>
        <div style={{ fontSize: "48px" }}>🎉</div>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1A3C6E", margin: 0 }}>
          You are in
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", maxWidth: "300px", margin: 0, lineHeight: "1.6" }}>
          {needsEmailConfirmation
            ? "Check your email to verify your account. After you confirm, sign in to complete your profile on SwiftHire."
            : "Your account is ready. You can sign in and start using SwiftHire."}
        </p>
        <div style={{ background: "#E1F5EE", borderRadius: "10px", padding: "12px 20px", fontSize: "13px", color: "#0F6E56", fontWeight: "500" }}>
          ✓ Account created successfully
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{ background: "transparent", border: "none", color: "#1A3C6E", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}
        >
          Back to home
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
