export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  optional = false,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          style={{
            fontSize: "12px",
            fontWeight: "500",
            color: "#1C1C1E",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {label}
          {optional && (
            <span style={{ color: "#9CA3AF", fontWeight: "400" }}>Optional</span>
          )}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          padding: "12px 14px",
          borderRadius: "8px",
          border: "1.5px solid #E5E7EB",
          fontSize: "14px",
          outline: "none",
          background: "#fff",
          color: "#1C1C1E",
          width: "100%",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#1A3C6E"
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E5E7EB"
        }}
      />
    </div>
  )
}
