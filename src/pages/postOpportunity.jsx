import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Input from "../components/input"
import Button from "../components/button"

export default function PostOpportunity() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    title: "",
    description: "",
    opportunity_type: "internship",
    industry: "general",
    location: "",
    is_paid: false,
    pay_range: "",
    duration: "",
    deadline: "",
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate("/signin"); return }
      setUser(user)
    }
    getUser()
  }, [navigate])

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    if (!form.title) return setError("Please enter a role title")
    if (!form.description) return setError("Please enter a description")
    if (!form.location) return setError("Please enter a location")
    if (!form.deadline) return setError("Please enter a deadline")

    setLoading(true)
    setError("")

    const { error: insertError } = await supabase
      .from("opportunities")
      .insert({
        organisation_id: user.id,
        title: form.title,
        description: form.description,
        opportunity_type: form.opportunity_type,
        industry: form.industry,
        location: form.location,
        is_paid: form.is_paid,
        duration: form.duration || null,
        deadline: form.deadline,
        pay_range: form.pay_range || null,
        is_active: true,
        is_featured: false,
      })

    if (insertError) {
      setError("Something went wrong. Please try again.")
    } else {
      setSuccess(true)
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
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1A3C6E", margin: "0 0 8px" }}>
          Opportunity posted
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 24px", maxWidth: "300px", lineHeight: "1.6" }}>
          Your listing is now live and visible to students and graduates across Ghana.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "300px" }}>
          <Button fullWidth variant="primary" onClick={() => navigate("/opportunities")}>
            View all opportunities
          </Button>
          <Button fullWidth variant="ghost" onClick={() => {
            setSuccess(false)
            setForm({
              title: "",
              description: "",
              opportunity_type: "internship",
              industry: "general",
              location: "",
              is_paid: false,
              pay_range: "",
              duration: "",
              deadline: "",
            })
          }}>
            Post another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAF9F7",
      fontFamily: "Inter, sans-serif",
    }}>

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
        padding: "24px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#1A3C6E",
            margin: "0 0 6px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}>
            Post an opportunity
          </h2>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
            Reach verified students and graduates across Ghana
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <Input
            label="Role title"
            placeholder="e.g. Research Assistant Intern"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>
              Opportunity type
            </label>
            <select
              value={form.opportunity_type}
              onChange={(e) => update("opportunity_type", e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1.5px solid #E5E7EB",
                fontSize: "14px",
                background: "#fff",
                color: "#1C1C1E",
                outline: "none",
              }}
            >
              <option value="internship">Internship</option>
              <option value="attachment">Attachment</option>
              <option value="ns_placement">NS Placement</option>
              <option value="campus_job">Campus Job</option>
              <option value="research">Research Role</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>
              Industry
            </label>
            <select
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1.5px solid #E5E7EB",
                fontSize: "14px",
                background: "#fff",
                color: "#1C1C1E",
                outline: "none",
              }}
            >
              <option value="general">General</option>
              <option value="tech">Technology</option>
              <option value="finance">Finance & Banking</option>
              <option value="health">Health & Medicine</option>
              <option value="agriculture">Agriculture</option>
              <option value="ngo">NGO & Development</option>
              <option value="government">Government & Public Sector</option>
              <option value="education">Education</option>
              <option value="media">Media & Communications</option>
              <option value="engineering">Engineering</option>
              <option value="legal">Legal</option>
              <option value="hospitality">Hospitality & Tourism</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>
              Description
            </label>
            <textarea
              placeholder="Describe the role, responsibilities, and what you are looking for..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1.5px solid #E5E7EB",
                fontSize: "13px",
                outline: "none",
                resize: "vertical",
                fontFamily: "Inter, sans-serif",
                color: "#1C1C1E",
                lineHeight: "1.5",
              }}
            />
          </div>

          <Input
            label="Location"
            placeholder="e.g. Accra, Kumasi, Remote"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />

          <Input
            label="Duration"
            placeholder="e.g. 3 months, 1 year"
            optional
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>
              Application deadline
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => update("deadline", e.target.value)}
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

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>
              Pay / stipend
            </label>
            <input
              placeholder="e.g. GH₵ 500/month, GH₵ 200/week, Negotiable"
              value={form.pay_range}
              onChange={(e) => update("pay_range", e.target.value)}
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
              Leave empty if unpaid or to be discussed
            </span>
          </div>

          <div
            onClick={() => update("is_paid", !form.is_paid)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              background: "#fff",
              borderRadius: "10px",
              border: form.is_paid ? "2px solid #0F9E7B" : "1.5px solid #E5E7EB",
              cursor: "pointer",
            }}
          >
            <div style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: form.is_paid ? "#0F9E7B" : "#F3F4F6",
              border: form.is_paid ? "none" : "1.5px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {form.is_paid && <span style={{ color: "#fff", fontSize: "11px" }}>✓</span>}
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#1C1C1E" }}>
                This is a paid opportunity
              </div>
              <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "2px" }}>
                Paid opportunities attract more applicants
              </div>
            </div>
          </div>

          {error && (
            <p style={{ fontSize: "12px", color: "#C0392B", margin: 0 }}>{error}</p>
          )}

          <Button fullWidth variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Posting..." : "Post opportunity"}
          </Button>

        </div>
      </div>
    </div>
  )
}