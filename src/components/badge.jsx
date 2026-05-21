export default function Badge({ label, variant = "teal" }) {
  const variants = {
    teal: { background: "#E1F5EE", color: "#0F6E56" },
    blue: { background: "#E6F1FB", color: "#185FA5" },
    amber: { background: "#FAEEDA", color: "#854F0B" },
    gray: { background: "#F3F4F6", color: "#6B7280" },
    green: { background: "#E1F5EE", color: "#0F6E56" },
  }

  return (
    <span
      style={{
        ...variants[variant],
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "500",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  )
}
