export default function Card({ children, padding = "20px" }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding,
        boxShadow: "0 2px 12px rgba(26, 60, 110, 0.08)",
        border: "0.5px solid #F3F4F6",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  )
}
