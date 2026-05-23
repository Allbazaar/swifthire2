import Badge from "./badge"

export default function OpportunityCard({ opportunity, onClick }) {
  const handleWhatsAppShare = (e) => {
    e.stopPropagation()
    const message = `🚀 *${opportunity.title}*\n\n🏢 ${opportunity.organisation_name}\n📍 ${opportunity.location}\n⏰ Deadline: ${new Date(opportunity.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}\n\n Apply on SwiftHire: ${window.location.origin}/opportunities/${opportunity.id}`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  const formatDeadline = (date) => {
    if (!date) return "No deadline"
    const d = new Date(date)
    const now = new Date()
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24))
    if (diff < 0) return "Closed"
    if (diff === 0) return "Today"
    if (diff <= 7) return `${diff} days left`
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }

  const typeLabels = {
    internship: "Internship",
    attachment: "Attachment",
    ns_placement: "NS Placement",
    campus_job: "Campus Job",
    research: "Research Role",
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "16px",
        border: "0.5px solid #F3F4F6",
        boxShadow: "0 2px 12px rgba(26, 60, 110, 0.06)",
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)"
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(26, 60, 110, 0.10)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(26, 60, 110, 0.06)"
      }}
    >
      {/* Header row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "10px",
        gap: "10px",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "#1A3C6E",
            lineHeight: "1.3",
            marginBottom: "3px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}>
            {opportunity.title}
          </div>
          <div style={{
            fontSize: "12px",
            color: "#6B7280",
          }}>
            {opportunity.organisation_name || "SwiftHire Partner"} · {opportunity.location}
          </div>
        </div>
        {opportunity.is_featured && (
          <Badge label="Featured" variant="amber" />
        )}
      </div>

      {/* Tags row */}
      <div style={{
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
        marginBottom: "12px",
      }}>
        <Badge
          label={typeLabels[opportunity.opportunity_type] || opportunity.opportunity_type}
          variant="blue"
        />
        {opportunity.is_paid && (
          <Badge label="Paid" variant="teal" />
        )}
        {opportunity.duration && (
          <Badge label={opportunity.duration} variant="gray" />
        )}
      </div>

      {/* Footer row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "0.5px solid #F3F4F6",
        paddingTop: "10px",
      }}>
        <div style={{
          fontSize: "11px",
          color: formatDeadline(opportunity.deadline) === "Closed" ? "#C0392B" :
                 formatDeadline(opportunity.deadline).includes("days") ? "#854F0B" : "#6B7280",
          fontWeight: "500",
        }}>
          ⏰ {formatDeadline(opportunity.deadline)}
        </div>
        <button
          onClick={handleWhatsAppShare}
          style={{
            background: "#E1F5EE",
            color: "#0F6E56",
            border: "none",
            borderRadius: "6px",
            padding: "5px 10px",
            fontSize: "11px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          Share
        </button>
      </div>
    </div>
  )
}