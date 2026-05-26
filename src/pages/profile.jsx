import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Button from "../components/button"
import Badge from "../components/badge"

const SKILLS = [
  "Research", "Python", "Design", "Writing", "Excel",
  "Finance", "Marketing", "Engineering", "Data Analysis",
  "Project Management", "Communication", "Accounting",
  "Legal", "Healthcare", "Education", "Agriculture"
]

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [studentProfile, setStudentProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    university: "",
    programme: "",
    academic_level: "",
    skills: [],
    available_from: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate("/signin"); return }

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      const { data: sp } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(p)
      setStudentProfile(sp)
      setForm({
        first_name: p?.first_name || "",
        last_name: p?.last_name || "",
        middle_name: p?.middle_name || "",
        university: sp?.university || "",
        programme: sp?.programme || "",
        academic_level: sp?.academic_level || "",
        skills: sp?.skills || [],
        available_from: sp?.available_from || "",
      })
      setLoading(false)
    }
    fetchProfile()
  }, [navigate])

  const toggleSkill = (skill) => {
    const current = form.skills || []
    const updated = current.includes(skill)
      ? current.filter(s => s !== skill)
      : [...current, skill]
    setForm(prev => ({ ...prev, skills: updated }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")

    const { data: { user } } = await supabase.auth.getUser()

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        middle_name: form.middle_name || null,
      })
      .eq("id", user.id)

    if (profileError) {
      setError("Failed to save profile. Please try again.")
      setSaving(false)
      return
    }

    const { error: studentError } = await supabase
      .from("student_profiles")
      .update({
        university: form.university,
        programme: form.programme,
        academic_level: form.academic_level,
        skills: form.skills,
        available_from: form.available_from || null,
      })
      .eq("id", user.id)

    if (studentError) {
      setError("Failed to save profile details. Please try again.")
      setSaving(false)
      return
    }

    setProfile(prev => ({ ...prev, ...form }))
    setStudentProfile(prev => ({ ...prev, ...form }))
    setSuccess(true)
    setEditing(false)
    setSaving(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#FAF9F7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
      }}>
        <p style={{ color: "#6B7280" }}>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAF9F7",
      fontFamily: "Inter, sans-serif",
    }}>

      {/* Navigation */}
      <nav style={{
        background: "#fff",
        borderBottom: "0.5px solid #F3F4F6",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
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
          onClick={() => navigate("/dashboard")}
          style={{
            background: "transparent",
            border: "none",
            color: "#6B7280",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          ← Dashboard
        </button>
      </nav>

      <div style={{
        padding: "20px 24px 40px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>

        {/* Profile header card */}
        <div style={{
          background: "#1A3C6E",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "16px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "600",
            flexShrink: 0,
          }}>
            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: "18px",
              fontWeight: "600",
              margin: "0 0 4px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}>
              {profile?.first_name} {profile?.last_name}
            </h2>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "20px",
                padding: "2px 10px",
                fontSize: "11px",
                textTransform: "capitalize",
              }}>
                {profile?.user_type}
              </span>
              {profile?.is_verified && (
                <span style={{
                  background: "#0F9E7B",
                  borderRadius: "20px",
                  padding: "2px 10px",
                  fontSize: "11px",
                }}>
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {success && (
          <div style={{
            background: "#E1F5EE",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "13px",
            color: "#0F6E56",
            fontWeight: "500",
            marginBottom: "16px",
          }}>
            ✓ Profile updated successfully
          </div>
        )}

        {/* Profile details */}
        {editing ? (
          <div style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "20px",
            border: "0.5px solid #F3F4F6",
            boxShadow: "0 2px 12px rgba(26, 60, 110, 0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1A3C6E", margin: 0 }}>
              Edit profile
            </h3>

            {["first_name", "last_name", "middle_name"].map(field => (
              <div key={field} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E", textTransform: "capitalize" }}>
                  {field.replace("_", " ")} {field === "middle_name" && "(optional)"}
                </label>
                <input
                  value={form[field]}
                  onChange={(e) => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                  style={{
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid #E5E7EB",
                    fontSize: "14px",
                    outline: "none",
                    color: "#1C1C1E",
                  }}
                />
              </div>
            ))}

            {profile?.user_type !== "organisation" && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>University</label>
                  <input
                    value={form.university}
                    onChange={(e) => setForm(prev => ({ ...prev, university: e.target.value }))}
                    style={{ padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", outline: "none", color: "#1C1C1E" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>Programme</label>
                  <input
                    value={form.programme}
                    onChange={(e) => setForm(prev => ({ ...prev, programme: e.target.value }))}
                    style={{ padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", outline: "none", color: "#1C1C1E" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>Skills</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {SKILLS.map(skill => (
                      <div
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: form.skills?.includes(skill) ? "2px solid #1A3C6E" : "1.5px solid #E5E7EB",
                          background: form.skills?.includes(skill) ? "#E6F1FB" : "#fff",
                          color: form.skills?.includes(skill) ? "#1A3C6E" : "#6B7280",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>Available from</label>
                  <input
                    type="date"
                    value={form.available_from}
                    onChange={(e) => setForm(prev => ({ ...prev, available_from: e.target.value }))}
                    style={{ padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", outline: "none", color: "#1C1C1E", width: "100%", boxSizing: "border-box" }}
                  />
                </div>
              </>
            )}

            {error && <p style={{ fontSize: "12px", color: "#C0392B", margin: 0 }}>{error}</p>}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Button fullWidth variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
              <Button fullWidth variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "20px",
            border: "0.5px solid #F3F4F6",
            boxShadow: "0 2px 12px rgba(26, 60, 110, 0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}>
            {[
              { label: "University", value: studentProfile?.university },
              { label: "Programme", value: studentProfile?.programme },
              { label: "Academic level", value: studentProfile?.academic_level ? `Level ${studentProfile.academic_level}` : null },
              { label: "Available from", value: studentProfile?.available_from ? new Date(studentProfile.available_from).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null },
            ].map(item => item.value && (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "0.5px solid #F3F4F6" }}>
                <span style={{ fontSize: "12px", color: "#6B7280" }}>{item.label}</span>
                <span style={{ fontSize: "13px", fontWeight: "500", color: "#1C1C1E" }}>{item.value}</span>
              </div>
            ))}

            {studentProfile?.skills?.length > 0 && (
              <div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px" }}>Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {studentProfile.skills.map(skill => (
                    <Badge key={skill} label={skill} variant="blue" />
                  ))}
                </div>
              </div>
            )}

            <Button fullWidth variant="ghost" onClick={() => setEditing(true)}>
              Edit profile
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}