import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import OpportunityCard from "../components/Opportunitycard"

export default function Opportunities() {
  const navigate = useNavigate()
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")

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

  const filtered = opportunities
    .filter(o => filter === "all" || o.opportunity_type === filter)
    .filter(o => industryFilter === "all" || o.industry === industryFilter)

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

        {/* Type filters */}
        <div style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "8px",
        }}>
          {[
            { value: "all", label: "All types" },
            { value: "internship", label: "Internships" },
            { value: "attachment", label: "Attachments" },
            { value: "ns_placement", label: "NS Placements" },
            { value: "research", label: "Research" },
            { value: "campus_job", label: "Campus Jobs" },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: filter === f.value ? "2px solid #1A3C6E" : "1.5px solid #E5E7EB",
                background: filter === f.value ? "#1A3C6E" : "#fff",
                color: filter === f.value ? "#fff" : "#6B7280",
                fontSize: "12px",
                fontWeight: filter === f.value ? "500" : "400",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Industry filters */}
        <div style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "8px",
        }}>
          {[
            { value: "all", label: "All industries" },
            { value: "tech", label: "Technology" },
            { value: "finance", label: "Finance" },
            { value: "health", label: "Health" },
            { value: "agriculture", label: "Agriculture" },
            { value: "ngo", label: "NGO" },
            { value: "government", label: "Government" },
            { value: "education", label: "Education" },
            { value: "media", label: "Media" },
            { value: "engineering", label: "Engineering" },
            { value: "legal", label: "Legal" },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setIndustryFilter(f.value)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: industryFilter === f.value ? "2px solid #0F9E7B" : "1.5px solid #E5E7EB",
                background: industryFilter === f.value ? "#0F9E7B" : "#fff",
                color: industryFilter === f.value ? "#fff" : "#6B7280",
                fontSize: "12px",
                fontWeight: industryFilter === f.value ? "500" : "400",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ fontSize: "14px", color: "#6B7280" }}>Loading...</p>
        )}

        {error && (
          <p style={{ fontSize: "12px", color: "#C0392B", margin: 0 }}>{error}</p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            border: "0.5px solid #F3F4F6",
          }}>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
              No opportunities found for this filter. Try a different category.
            </p>
          </div>
        )}

        {filtered.map((opp) => (
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