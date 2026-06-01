import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import OpportunityCard from "../components/Opportunitycard"

export default function SavedOpportunities() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSaved = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate("/signin"); return }

      const { data, error } = await supabase
        .from("saved_opportunities")
        .select(`
          *,
          opportunities (*)
        `)
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false })

      if (!error && data) {
        const formatted = data
          .filter(s => s.opportunities)
          .map(s => s.opportunities)
        setSaved(formatted)
      }

      setLoading(false)
    }

    fetchSaved()
  }, [navigate])

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
            Saved opportunities
          </h2>
          <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
            {saved.length} saved listing{saved.length !== 1 ? "s" : ""}
          </p>
        </div>

        {saved.length === 0 ? (
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "40px 20px",
            border: "0.5px solid #F3F4F6",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔖</div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1A3C6E", margin: "0 0 6px" }}>
              No saved opportunities yet
            </h3>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 20px" }}>
              Tap the bookmark icon on any opportunity to save it for later
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
            {saved.map(opportunity => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onClick={() => navigate(`/opportunities/${opportunity.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}