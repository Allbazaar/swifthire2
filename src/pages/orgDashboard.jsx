import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function OrgDashboard() {
  const navigate = useNavigate()
  const [opportunities, setOpportunities] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate("/signin"); return }

      const { data: opps } = await supabase
        .from("opportunities")
        .select("*")
        .eq("organisation_id", user.id)
        .order("created_at", { ascending: false })

      if (opps) {
        setOpportunities(opps)
        if (opps.length > 0) {
          setSelectedOpp(opps[0].id)
          fetchApplications(opps[0].id)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [navigate])

  const fetchApplications = async (oppId) => {
    const { data } = await supabase
      .from("applications")
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          user_type,
          is_verified
        ),
        student_profiles (
          university,
          programme,
          skills
        )
      `)
      .eq("opportunity_id", oppId)
      .order("applied_at", { ascending: false })

    if (data) setApplications(data)
  }

  const handleSelectOpp = (oppId) => {
    setSelectedOpp(oppId)
    setApplications([])
    fetchApplications(oppId)
  }

  const updateStatus = async (applicationId, newStatus) => {
    setUpdating(applicationId)

    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", applicationId)

    if (!error) {
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      )
    }

    setUpdating(null)
  }

  const statusConfig = {
    pending: { label: "Pending", bg: "#FAEEDA", color: "#854F0B" },
    shortlisted: { label: "Shortlisted", bg: "#E1F5EE", color: "#0F6E56" },
    rejected: { label: "Rejected", bg: "#FAECE7", color: "#993C1D" },
    hired: { label: "Hired", bg: "#E6F1FB", color: "#185FA5" },
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
            Applicants
          </h2>
          <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
            {opportunities.length} active listing{opportunities.length !== 1 ? "s" : ""}
          </p>
        </div>

        {opportunities.length === 0 ? (
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "40px 20px",
            border: "0.5px solid #F3F4F6",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>📋</div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1A3C6E", margin: "0 0 6px" }}>
              No opportunities posted yet
            </h3>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 20px" }}>
              Post your first opportunity to start receiving applications
            </p>
            <button
              onClick={() => navigate("/post-opportunity")}
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
              Post an opportunity
            </button>
          </div>
        ) : (
          <>
            {/* Opportunity selector */}
            <div style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "12px",
              marginBottom: "16px",
            }}>
              {opportunities.map(opp => (
                <button
                  key={opp.id}
                  onClick={() => handleSelectOpp(opp.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "20px",
                    border: selectedOpp === opp.id ? "2px solid #1A3C6E" : "1.5px solid #E5E7EB",
                    background: selectedOpp === opp.id ? "#1A3C6E" : "#fff",
                    color: selectedOpp === opp.id ? "#fff" : "#6B7280",
                    fontSize: "12px",
                    fontWeight: selectedOpp === opp.id ? "500" : "400",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {opp.title}
                </button>
              ))}
            </div>

            {/* Applications list */}
            {applications.length === 0 ? (
              <div style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "30px 20px",
                border: "0.5px solid #F3F4F6",
                textAlign: "center",
              }}>
                <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
                  No applications yet for this listing
                </p>
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
                    {/* Applicant header */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "10px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "#E6F1FB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#185FA5",
                          flexShrink: 0,
                        }}>
                          {app.profiles?.first_name?.[0]}{app.profiles?.last_name?.[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "600", color: "#1A3C6E" }}>
                            {app.profiles?.first_name} {app.profiles?.last_name}
                            {app.profiles?.is_verified && (
                              <span style={{ fontSize: "10px", color: "#0F9E7B", marginLeft: "6px" }}>✓ Verified</span>
                            )}
                          </div>
                          <div style={{ fontSize: "11px", color: "#6B7280" }}>
                            {app.student_profiles?.university} · {app.student_profiles?.programme}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        background: statusConfig[app.status]?.bg,
                        color: statusConfig[app.status]?.color,
                        borderRadius: "20px",
                        padding: "3px 10px",
                        fontSize: "11px",
                        fontWeight: "500",
                      }}>
                        {statusConfig[app.status]?.label}
                      </div>
                    </div>

                    {/* Skills */}
                    {app.student_profiles?.skills?.length > 0 && (
                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px",
                        marginBottom: "10px",
                      }}>
                        {app.student_profiles.skills.slice(0, 4).map(skill => (
                          <span
                            key={skill}
                            style={{
                              background: "#E6F1FB",
                              color: "#185FA5",
                              borderRadius: "20px",
                              padding: "2px 8px",
                              fontSize: "10px",
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Cover note */}
                    {app.cover_note && (
                      <div style={{
                        background: "#FAF9F7",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        fontSize: "12px",
                        color: "#4B5563",
                        lineHeight: "1.5",
                        marginBottom: "12px",
                      }}>
                        "{app.cover_note}"
                      </div>
                    )}

                    {/* Status controls */}
                    <div style={{
                      borderTop: "0.5px solid #F3F4F6",
                      paddingTop: "12px",
                    }}>
                      <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "8px" }}>
                        Update status:
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {["shortlisted", "hired", "rejected", "pending"].map(status => (
                          <button
                            key={status}
                            onClick={() => updateStatus(app.id, status)}
                            disabled={app.status === status || updating === app.id}
                            style={{
                              padding: "5px 12px",
                              borderRadius: "20px",
                              border: app.status === status ? "2px solid" : "1.5px solid #E5E7EB",
                              borderColor: app.status === status ? statusConfig[status]?.color : "#E5E7EB",
                              background: app.status === status ? statusConfig[status]?.bg : "#fff",
                              color: app.status === status ? statusConfig[status]?.color : "#6B7280",
                              fontSize: "11px",
                              fontWeight: app.status === status ? "500" : "400",
                              cursor: app.status === status ? "default" : "pointer",
                              opacity: updating === app.id ? 0.6 : 1,
                            }}
                          >
                            {statusConfig[status]?.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{
                      fontSize: "11px",
                      color: "#9CA3AF",
                      marginTop: "10px",
                    }}>
                      Applied {new Date(app.applied_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}