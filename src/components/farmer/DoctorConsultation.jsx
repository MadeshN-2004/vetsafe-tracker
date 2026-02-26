import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db, collection, query, where, getDocs, addDoc, serverTimestamp } from '../../config/firebase'
import './DoctorConsultation.css'

function DoctorConsultation() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [animals, setAnimals] = useState([])
  const [formData, setFormData] = useState({ animalId: '', urgency: '', symptoms: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        navigate('/farmer-login')
        return
      }

      const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', currentUser.uid)))
      if (!userDoc.empty && userDoc.docs[0].data().role === 'farmer') {
        setUser(currentUser)
        loadAnimals(currentUser.uid)
      } else {
        navigate('/farmer-login')
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const loadAnimals = async (farmerId) => {
    const q = query(collection(db, 'animals'), where('farmerId', '==', farmerId))
    const snapshot = await getDocs(q)
    setAnimals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Submitting consultation request:', {
        farmerId: user.uid,
        animalId: formData.animalId,
        urgency: formData.urgency,
        symptoms: formData.symptoms,
        status: 'pending'
      })

      const docRef = await addDoc(collection(db, 'consultationRequests'), {
        farmerId: user.uid,
        animalId: formData.animalId,
        urgency: formData.urgency,
        symptoms: formData.symptoms,
        status: 'pending',
        createdAt: serverTimestamp()
      })

      console.log('Request submitted successfully with ID:', docRef.id)
      setSuccess(true)
      setFormData({ animalId: '', urgency: '', symptoms: '' })
      setTimeout(() => {
        navigate('/farmer-dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Error submitting request: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="consult-container">
      <div className="page-header">
        <h1 className="page-title">Doctor Consultation</h1>
        <button className="back-btn" onClick={() => navigate('/farmer-dashboard')}>
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>
      </div>

      <div className="consult-card">
        <h2 className="card-title">
          <i className="fas fa-user-md"></i>
          Request Veterinary Consultation
        </h2>

        {success && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle"></i>
            Consultation request submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Animal</label>
            <select 
              className="form-select" 
              value={formData.animalId} 
              onChange={(e) => setFormData({...formData, animalId: e.target.value})} 
              required
            >
              <option value="">Choose an animal</option>
              {animals.map(a => (
                <option key={a.id} value={a.animalId}>
                  {a.speciesDisplay} - #{a.animalId}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Urgency Level</label>
            <select 
              className="form-select" 
              value={formData.urgency} 
              onChange={(e) => setFormData({...formData, urgency: e.target.value})} 
              required
            >
              <option value="">Select urgency</option>
              <option value="Low">Low - Routine checkup</option>
              <option value="Medium">Medium - Needs attention</option>
              <option value="High">High - Urgent care needed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Symptoms / Description</label>
            <textarea 
              className="form-textarea" 
              value={formData.symptoms} 
              onChange={(e) => setFormData({...formData, symptoms: e.target.value})} 
              placeholder="Describe the symptoms or reason for consultation..."
              rows="5"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            <i className="fas fa-paper-plane"></i>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default DoctorConsultation
