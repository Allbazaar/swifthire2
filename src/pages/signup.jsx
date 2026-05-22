import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Step1Credentials from "../components/signup/Step1Credentials"
import Step2Name from "../components/signup/Step2Name"
import Step3UserType from "../components/signup/Step3UserType"
import Step4Skills from "../components/signup/Step4Skills"
import Step5Verify from "../components/signup/Step5Verify"

export default function SignUp() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    middleName: "",
    userType: "",
    university: "",
    programme: "",
    academicLevel: "",
    graduationYear: "",
    nsStatus: "",
    organisationName: "",
    organisationType: "",
    description: "",
    skills: [],
    availableFrom: "",
  })

  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }))
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const steps = [
    { number: 1, label: "Account" },
    { number: 2, label: "Name" },
    { number: 3, label: "Type" },
    { number: 4, label: "Skills" },
    { number: 5, label: "Verify" },
  ]

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAF9F7",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Inter, sans-serif",
    }}>

      {/* Header */}
      <div style={{
        background: "#fff",
        borderBottom: "0.5px solid #F3F4F6",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            color: "#6B7280",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>

      {/* Progress bar */}
      <div style={{
        background: "#fff",
        padding: "16px 24px 0",
        borderBottom: "0.5px solid #F3F4F6",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}>
          {steps.map((step) => (
            <div key={step.number} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              flex: 1,
            }}>
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: currentStep >= step.number ? "#1A3C6E" : "#F3F4F6",
                color: currentStep >= step.number ? "#fff" : "#9CA3AF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "500",
                transition: "all 0.3s",
              }}>
                {currentStep > step.number ? "✓" : step.number}
              </div>
              <span style={{
                fontSize: "10px",
                color: currentStep >= step.number ? "#1A3C6E" : "#9CA3AF",
                fontWeight: currentStep >= step.number ? "500" : "400",
              }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress line */}
        <div style={{
          height: "3px",
          background: "#F3F4F6",
          borderRadius: "2px",
          marginBottom: "0",
        }}>
          <div style={{
            height: "100%",
            background: "#1A3C6E",
            borderRadius: "2px",
            width: `${((currentStep - 1) / 4) * 100}%`,
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Step content */}
      <div style={{
        flex: 1,
        padding: "24px",
        maxWidth: "480px",
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        {currentStep === 1 && (
          <Step1Credentials
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <Step2Name
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 3 && (
          <Step3UserType
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 4 && (
          <Step4Skills
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 5 && (
          <Step5Verify
            formData={formData}
            onBack={prevStep}
          />
        )}
      </div>

    </div>
  )
}