import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Badge from "../components/badge"
import Button from "../components/button"

export default function OpportunityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [opportunity, setOpportunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const [coverNote, setCoverNote] = useState("")
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: opp } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .single()

      setOpportunity(opp)

      if (user && opp) {
        const { data: existing } = await supabase
          .from("applications")
          .select("id")
          .eq("opportunity_id", id)
          .eq("applicant_id", user.id)
          .single()

        if (existing) setApplied(true)
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  const handleApply = async () => {
    if (!user) {
      navigate("/signin")
      return
    }

    if (!coverNote.trim()) {
      setError("Please write a short cover note")
      return
    }

    setApplying(true)
    setError("")

    const { error: applyError } = await supabase
      .from("applications")
      .insert({
        opportunity_id: id,
        applicant_id: user.id,
        cover_note: coverNote,
        status: "pending",
      })

    if (applyError) {
      setError("Something went wrong. Please try again.")
    } else {
      setSubmitSuccess(true)
      setApplied(true)
    }

    setApplying(false)
  }

  const handleWhatsAppShare = () => {
    const message = `🚀 *${opportunity.title}*\n\n📍 ${opportunity.location}\n⏰ Deadline: ${new Date(opportunity.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}\n\nApply on SwiftHire: ${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  }

  const typeLabels = {
    internship: "Internship",
    attachment: "Attachment",
    ns_placement: "NS Placement",
    campus_job: "Campus Job",
    research: "Research Role",
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

  if (!opportunity) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#FAF9F7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        flexDirection: "column",
        gap: "16px",
      }}>
        <p style={{ color: "#6B7280" }}>Opportunity not found.</p>
        <Button variant="ghost" onClick={() => navigate("/opportunities")}>
          Back to listings
        </Button>
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
          onClick={() => navigate("/opportunities")}
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
      </nav>

      <div style={{
        padding: "20px 24px 40px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>

        {/* Header card */}
        <div style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "20px",
          border: "0.5px solid #F3F4F6",
          boxShadow: "0 2px 12px rgba(26, 60, 110, 0.06)",
          marginBottom: "16px",
        }}>
          <h1 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1A3C6E",
            margin: "0 0 6px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            lineHeight: "1.3",
          }}>
            {opportunity.title}
          </h1>

          <p style={{
            fontSize: "13px",
            color: "#6B7280",
            margin: "0 0 14px",
          }}>
            {opportunity.organisation_name || "SwiftHire Partner"} · {opportunity.location}
          </p>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            <Badge label={typeLabels[opportunity.opportunity_type] || opportunity.opportunity_type} variant="blue" />
            {opportunity.is_paid && <Badge label="Paid" variant="teal" />}
            {opportunity.duration && <Badge label={opportunity.duration} variant="gray" />}
            {opportunity.is_featured && <Badge label="Featured" variant="amber" />}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}>
            <div style={{
              background: "#FAF9F7",
              borderRadius: "8px",
              padding: "10px 12px",
            }}>
              <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "2px" }}>DEADLINE</div>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#1C1C1E" }}>
                {opportunity.deadline
                  ? new Date(opportunity.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                  : "Open ended"}
              </div>
            </div>
            <div style={{
              background: "#FAF9F7",
              borderRadius: "8px",
              padding: "10px 12px",
            }}>
              <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "2px" }}>LOCATION</div>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#1C1C1E" }}>
                {opportunity.location}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "20px",
          border: "0.5px solid #F3F4F6",
          boxShadow: "0 2px 12px rgba(26, 60, 110, 0.06)",
          marginBottom: "16px",
        }}>
          <h3 style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#1A3C6E",
            margin: "0 0 10px",
          }}>
            About this opportunity
          </h3>
          <p style={{
            fontSize: "13px",
            color: "#4B5563",
            lineHeight: "1.7",
            margin: 0,
          }}>
            {opportunity.description}
          </p>

          {opportunity.skills_required?.length > 0 && (
            <div style={{ marginTop: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: "500", color: "#6B7280", marginBottom: "8px" }}>
                Skills required
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {opportunity.skills_required.map(skill => (
                  <Badge key={skill} label={skill} variant="blue" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Apply section */}
        {submitSuccess ? (
          <div style={{
            background: "#E1F5EE",
            borderRadius: "14px",
            padding: "20px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎉</div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0F6E56", margin: "0 0 6px" }}>
              Application submitted
            </h3>
            <p style={{ fontSize: "12px", color: "#0F6E56", margin: 0 }}>
              The organisation will review your application and be in touch.
            </p>
          </div>
        ) : applied ? (
          <div style={{
            background: "#E6F1FB",
            borderRadius: "14px",
            padding: "16px",
            textAlign: "center",
            fontSize: "13px",
            color: "#185FA5",
            fontWeight: "500",
          }}>
            ✓ You have already applied for this opportunity
          </div>
        ) : showApplyForm ? (
          <div style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "20px",
            border: "0.5px solid #F3F4F6",
            boxShadow: "0 2px 12px rgba(26, 60, 110, 0.06)",
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1A3C6E", margin: "0 0 12px" }}>
              Your application
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", fontWeight: "500", color: "#1C1C1E" }}>
                Cover note
              </label>
              <textarea
                placeholder="Tell the organisation why you are a good fit for this role..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
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

            {error && (
              <p style={{ fontSize: "12px", color: "#C0392B", margin: "0 0 10px" }}>{error}</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Button fullWidth variant="primary" onClick={handleApply} disabled={applying}>
                {applying ? "Submitting..." : "Submit application"}
              </Button>
              <Button fullWidth variant="ghost" onClick={() => setShowApplyForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Button
              fullWidth
              variant="primary"
              onClick={() => user ? setShowApplyForm(true) : navigate("/signin")}
            >
              {user ? "Apply for this role" : "Sign in to apply"}
            </Button>
            <button
              onClick={handleWhatsAppShare}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "8px",
                background: "#E1F5EE",
                color: "#0F6E56",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Share via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  )
}