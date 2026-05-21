export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = false,
}) {
  const base = {
    padding: "13px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    width: fullWidth ? "100%" : "auto",
    transition: "opacity 0.2s",
    opacity: disabled ? 0.6 : 1,
  }

  const variants = {
    primary: {
      background: "#0F9E7B",
      color: "#fff",
    },
    secondary: {
      background: "#1A3C6E",
      color: "#fff",
    },
    ghost: {
      background: "transparent",
      color: "#1A3C6E",
      border: "1.5px solid #1A3C6E",
    },
    amber: {
      background: "#E8A020",
      color: "#fff",
    },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  )
}
