import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function MyApplications() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate("/signin"); return }

      const { data: appsData, error } = await supabase
      .from("applications")
      .select(`
        *,
        opportunities (
          title,
          location,
          opportunity_type,
          deadline,
          organisation_id
        )
      `)
      .eq("applicant_id", user.id)
      .order("applied_at", { ascending: false })
    
    if (!error && appsData) {
      const orgIds = appsData
        .map(a => a.opportunities?.organisation_id)
        .filter(Boolean)
    
      const { data: orgProfiles } = await supabase
        .from("profiles")
        .select("id, phone")
        .in("id", orgIds)
    
      const enriched = appsData.map(app => ({
        ...app,
        org_phone: orgProfiles?.find(p => p.id === app.opportunities?.organisation_id)?.phone || null
      }))
    
      setApplications(enriched)
    }
    setLoading(false)
    return

    }

    fetchApplications()
  }, [navigate])

  const statusConfig = {
    pending: { label: "Pending review", bg: "#FAEEDA", color: "#854F0B" },
    shortlisted: { label: "Shortlisted", bg: "#E1F5EE", color: "#0F6E56" },
    rejected: { label: "Not selected", bg: "#FAECE7", color: "#993C1D" },
    hired: { label: "Hired", bg: "#E6F1FB", color: "#185FA5" },
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

        <div style={{ marginBottom: "20px" }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#1A3C6E",
            margin: "0 0 4px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}>
            My applications
          </h2>
          <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
            {applications.length} application{applications.length !== 1 ? "s" : ""} submitted
          </p>
        </div>

        {applications.length === 0 ? (
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "40px 20px",
            border: "0.5px solid #F3F4F6",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>📋</div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1A3C6E", margin: "0 0 6px" }}>
              No applications yet
            </h3>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 20px" }}>
              Browse opportunities and apply to get started
            </p>
            <button
              onClick={() => navigate("/opportunities")}
              style={{
                background: "#1A3C6E",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Browse opportunities
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {applications.map(app => (
              <div
                key={app.id}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "0.5px solid #F3F4F6",
                  boxShadow: "0 2px 12px rgba(26, 60, 110, 0.06)",
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                  gap: "10px",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1A3C6E",
                      marginBottom: "3px",
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                    }}>
                      {app.opportunities?.title || "Opportunity"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>
                      {app.opportunities?.location} · {typeLabels[app.opportunities?.opportunity_type] || app.opportunities?.opportunity_type}
                    </div>
                  </div>
                  <div style={{
                    background: statusConfig[app.status]?.bg || "#F3F4F6",
                    color: statusConfig[app.status]?.color || "#6B7280",
                    borderRadius: "20px",
                    padding: "3px 10px",
                    fontSize: "11px",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}>
                    {statusConfig[app.status]?.label || app.status}
                  </div>
                </div>

                {app.cover_note && (
                  <div style={{
                    background: "#FAF9F7",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "12px",
                    color: "#4B5563",
                    lineHeight: "1.5",
                    marginBottom: "10px",
                  }}>
                    "{app.cover_note}"
                  </div>
                )}

<div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTop: "0.5px solid #F3F4F6",
  paddingTop: "10px",
}}>
  <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
    Applied {new Date(app.applied_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
  </span>
  <div style={{ display: "flex", gap: "6px" }}>
    {app.status === "hired" && app.org_phone && (
      <button
        onClick={() => window.open(`https://wa.me/${app.org_phone.replace(/\D/g, "")}`, "_blank")}
        style={{
          background: "#E1F5EE",
          border: "none",
          color: "#0F6E56",
          borderRadius: "6px",
          padding: "4px 10px",
          fontSize: "11px",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        WhatsApp org
      </button>
    )}
    <button
      onClick={() => navigate(`/opportunities/${app.opportunity_id}`)}
      style={{
        background: "transparent",
        border: "1.5px solid #E5E7EB",
        color: "#1A3C6E",
        borderRadius: "6px",
        padding: "4px 10px",
        fontSize: "11px",
        cursor: "pointer",
      }}
    >
      View role
    </button>
  </div>
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}