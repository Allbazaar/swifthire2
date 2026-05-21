import { useNavigate } from "react-router-dom"
import Button from "../components/button"
import Badge from "../components/badge"

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAF9F7",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Inter, sans-serif",
    }}>

      {/* Navigation bar */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        background: "#fff",
        borderBottom: "0.5px solid #F3F4F6",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          background: "#1A3C6E",
          color: "#fff",
          padding: "7px 18px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          letterSpacing: "-0.3px",
        }}>
          SwiftHire
        </div>
        <button
          onClick={() => navigate("/signin")}
          style={{
            background: "transparent",
            border: "1.5px solid #1A3C6E",
            color: "#1A3C6E",
            padding: "7px 18px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </nav>

      {/* Hero section */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px 32px",
        textAlign: "center",
      }}>

        {/* Badge */}
        <div style={{ marginBottom: "20px" }}>
          <Badge label="Built for Ghana 🇬🇭" variant="teal" />
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(26px, 6vw, 42px)",
          fontWeight: "700",
          color: "#1A3C6E",
          lineHeight: "1.2",
          maxWidth: "520px",
          margin: "0 0 16px",
          fontFamily: "Plus Jakarta Sans, sans-serif",
        }}>
          Where Ghanaian careers begin
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: "15px",
          color: "#6B7280",
          maxWidth: "400px",
          lineHeight: "1.7",
          margin: "0 0 36px",
        }}>
          SwiftHire connects students, National Service personnel, 
          and graduates with verified opportunities across Ghana — 
          internships, attachments, research roles, and more.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "320px",
        }}>
          <Button
            fullWidth
            variant="primary"
            onClick={() => navigate("/signup")}
          >
            Get started — it's free
          </Button>
          <Button
            fullWidth
            variant="ghost"
            onClick={() => navigate("/signin")}
          >
            I already have an account
          </Button>
        </div>

      </div>

      {/* Feature highlights */}
      <div style={{
        padding: "32px 24px 48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        maxWidth: "480px",
        margin: "0 auto",
        width: "100%",
      }}>

        <p style={{
          fontSize: "12px",
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "4px",
        }}>
          What SwiftHire does
        </p>

        {[
          { icon: "🎓", title: "For students", desc: "Find internships and attachments at verified Ghanaian organisations" },
          { icon: "🏢", title: "For organisations", desc: "Post opportunities and reach verified, skilled Ghanaian talent fast" },
          { icon: "🚀", title: "For NS personnel", desc: "Discover private sector host organisations before your posting" },
        ].map((item) => (
          <div key={item.title} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            background: "#fff",
            borderRadius: "12px",
            padding: "14px 16px",
            width: "100%",
            boxSizing: "border-box",
            boxShadow: "0 2px 12px rgba(26, 60, 110, 0.06)",
            border: "0.5px solid #F3F4F6",
          }}>
            <span style={{ fontSize: "22px", flexShrink: 0 }}>{item.icon}</span>
            <div>
              <div style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#1A3C6E",
                marginBottom: "3px",
              }}>
                {item.title}
              </div>
              <div style={{
                fontSize: "12px",
                color: "#6B7280",
                lineHeight: "1.5",
              }}>
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: "16px 24px",
        borderTop: "0.5px solid #F3F4F6",
        textAlign: "center",
        fontSize: "12px",
        color: "#9CA3AF",
        background: "#fff",
      }}>
        © 2025 SwiftHire · Built for Ghana · swifthire.com.gh
      </div>

    </div>
  )
}
