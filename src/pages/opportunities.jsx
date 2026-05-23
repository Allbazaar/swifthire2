import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import OpportunityCard from "../components/Opportunitycard"

export default function Opportunities() {
  const navigate = useNavigate()
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOpportunities = async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setOpportunities(data)
      } else if (error) {
        setError(error.message)
      }
      setLoading(false)
    }

    fetchOpportunities()
  }, [])

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
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            background: "transparent",
            border: "none",
            color: "#1A3C6E",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          ← Dashboard
        </button>
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
        <div style={{ width: "80px" }} />
      </nav>

      <div style={{
        padding: "24px",
        maxWidth: "480px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}>
        <div>
          <h1 style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#1A3C6E",
            margin: "0 0 6px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}>
            Opportunities
          </h1>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
            Verified roles across Ghana
          </p>
        </div>

        {loading && (
          <p style={{ fontSize: "14px", color: "#6B7280" }}>Loading...</p>
        )}

        {error && (
          <p style={{ fontSize: "12px", color: "#C0392B", margin: 0 }}>{error}</p>
        )}

        {!loading && !error && opportunities.length === 0 && (
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            border: "0.5px solid #F3F4F6",
          }}>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
              No active opportunities yet. Check back soon.
            </p>
          </div>
        )}

        {opportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            onClick={() => navigate(`/opportunities/${opp.id}`)}
          />
        ))}
      </div>
    </div>
  )
}
