import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function Dashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        navigate("/signin")
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    getProfile()
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
        <p style={{ color: "#6B7280", fontSize: "14px" }}>Loading...</p>
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
          type="button"
          onClick={async () => {
            await supabase.auth.signOut()
            navigate("/")
          }}
          style={{
            background: "transparent",
            border: "1.5px solid #E5E7EB",
            color: "#6B7280",
            padding: "6px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </nav>

      {/* Content */}
      <div style={{
        padding: "24px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>

        {/* Welcome card */}
        <div style={{
          background: "#1A3C6E",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "20px",
          color: "#fff",
        }}>
          <p style={{ fontSize: "12px", opacity: 0.7, margin: "0 0 4px" }}>
            Welcome back
          </p>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "600",
            margin: "0 0 8px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}>
            {profile?.first_name} {profile?.last_name}
          </h2>
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "20px",
            padding: "3px 10px",
            fontSize: "11px",
            textTransform: "capitalize",
          }}>
            {profile?.user_type}
            {profile?.is_verified && " · ✓ Verified"}
          </div>
        </div>

        {/* Opportunities section */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/opportunities")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/opportunities")}
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            border: "0.5px solid #F3F4F6",
            boxShadow: "0 2px 12px rgba(26, 60, 110, 0.06)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#1A3C6E",
              margin: "0 0 4px",
            }}>
              Browse opportunities
            </h3>
            <p style={{
              fontSize: "12px",
              color: "#6B7280",
              margin: 0,
            }}>
              Internships, attachments, NS placements and more
            </p>
          </div>
          <div style={{ fontSize: "20px" }}>→</div>
        </div>

        {/* Post opportunity - show for organisations */}
        {profile?.user_type === "organisation" && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate("/post-opportunity")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/post-opportunity")}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              border: "0.5px solid #F3F4F6",
              boxShadow: "0 2px 12px rgba(26, 60, 110, 0.06)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <div>
              <h3 style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#0F9E7B",
                margin: "0 0 4px",
              }}>
                Post an opportunity
              </h3>
              <p style={{
                fontSize: "12px",
                color: "#6B7280",
                margin: 0,
              }}>
                Reach verified Ghanaian talent today
              </p>
            </div>
            <div style={{ fontSize: "20px" }}>→</div>
          </div>
        )}

      </div>
    </div>
  )
}
