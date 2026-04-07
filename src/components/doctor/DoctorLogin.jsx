import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, doc, getDoc, setDoc, serverTimestamp } from '../../config/firebase'
import './DoctorLogin.css'

export default function DoctorLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const showMsg = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 5000)
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      
      if (userDoc.exists() && userDoc.data().role === 'doctor') {
        showMsg('Login successful! Redirecting...', 'success')
        setTimeout(() => navigate('/doctor-dashboard'), 1500)
      } else {
        await auth.signOut()
        showMsg('This account is not registered as a doctor.', 'error')
        setLoading(false)
      }
    } catch (error) {
      const errorMessages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-email': 'Invalid email format.',
        'auth/invalid-credential': 'Invalid email or password.'
      }
      showMsg(errorMessages[error.code] || 'Login failed.', 'error')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))

      if (userDoc.exists()) {
        if (userDoc.data().role === 'doctor') {
          navigate('/doctor-dashboard')
        } else {
          await auth.signOut()
          showMsg('This account is not registered as a doctor.', 'error')
        }
      } else {
        await setDoc(doc(db, 'users', result.user.uid), {
          name: result.user.displayName || 'Doctor',
          email: result.user.email,
          role: 'doctor',
          verified: false,
          specialization: 'Veterinary Medicine',
          createdAt: serverTimestamp()
        })
        navigate('/doctor-dashboard')
      }
    } catch (error) {
      showMsg('Google sign-in failed.', 'error')
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      showMsg('Password reset link sent!', 'success')
      setTimeout(() => setShowReset(false), 3000)
    } catch (error) {
      showMsg('Failed to send reset email.', 'error')
    }
  }

  return (
    <div className="login-wrapper">
      {/* Animated Background Elements */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Floating Icons */}
      <div className="floating-icons">
        <span className="float-icon icon-1">🩺</span>
        <span className="float-icon icon-2">💊</span>
        <span className="float-icon icon-3">🔬</span>
        <span className="float-icon icon-4">⚕️</span>
        <span className="float-icon icon-5">🏥</span>
      </div>

      {/* Doctor Image Section */}
      <div className="doctor-section">
        <div className="doctor-image-wrapper">
          <img 
            src="/images/man-is-holding-cow-smiling-camera_1237789-76.jpg" 
            alt="Veterinary Doctor" 
            className="doctor-image"
          />
        </div>
        <div className="doctor-welcome">
          <h1>Welcome Back, Doctor!</h1>
          <p>Continue providing excellent veterinary care with VetSafe Tracker</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <div className="container">
        <div className="header">
          <div className="header-icon-wrapper">
            <div className="icon-circle"></div>
            <div className="header-icon">👨⚕️</div>
          </div>
          <h2>Doctor Login</h2>
          <p className="subtitle">Welcome back to VetSafe Tracker</p>
        </div>

        {!showReset ? (
          <>
            {message.text && <div className={`message ${message.type} show`}><span className="msg-icon">{message.type === 'error' ? '⚠️' : '✅'}</span>{message.text}</div>}

            <button className="google-btn" onClick={handleGoogleLogin}>
              <svg width="18" height="18" viewBox="0 0 20 20">
                <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
                <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
                <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
                <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider">or</div>

            <form onSubmit={handleEmailLogin}>
              <div className="form-group">
                <label>
                  <span className="label-icon">✉️</span>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="doctor@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="forgot-link">
                <a onClick={() => setShowReset(true)}>Forgot Password?</a>
              </div>

              <button type="submit" className="button" disabled={loading}>
                <div className="button-content">
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <span className="button-arrow">→</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="login-link">
              New doctor? <a onClick={() => navigate('/doctor-register')}>Create account</a>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span>Secure</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">⚡</span>
                <span>Fast</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>Verified</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="reset-title">Reset Password</h2>
            <p className="subtitle">Enter your email to receive a reset link</p>

            {message.text && <div className={`message ${message.type} show`}><span className="msg-icon">{message.type === 'error' ? '⚠️' : '✅'}</span>{message.text}</div>}

            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label>
                  <span className="label-icon">✉️</span>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="doctor@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <button type="button" className="button button-secondary" onClick={() => setShowReset(false)}>
                ← Back to Login
              </button>
              <button type="submit" className="button">Send Reset Link</button>
            </form>
          </>
        )}
        </div>
      </div>
    </div>
  )
}
