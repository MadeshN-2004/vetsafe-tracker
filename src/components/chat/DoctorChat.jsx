import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db, collection, query, where, getDocs, doc, getDoc } from '../../config/firebase'
import './DoctorChat.css'

export default function DoctorChat() {
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { navigate('/doctor-login'); return }
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists() || userDoc.data().role !== 'doctor') {
        navigate('/doctor-login'); return
      }
      setDoctor({ uid: user.uid, ...userDoc.data() })

      // Load all farmers who have sent consultation requests to this doctor
      const reqSnap = await getDocs(collection(db, 'consultationRequests'))
      const farmerIds = [...new Set(reqSnap.docs.map(d => d.data().farmerId))]

      const farmerList = await Promise.all(
        farmerIds.map(async (fid) => {
          const fDoc = await getDoc(doc(db, 'users', fid))
          return fDoc.exists() ? { uid: fid, ...fDoc.data() } : null
        })
      )
      setFarmers(farmerList.filter(Boolean))
      setLoading(false)
    })
    return () => unsub()
  }, [navigate])

  const openChat = (farmerId) => {
    navigate(`/chat/${farmerId}_${doctor.uid}`)
  }

  return (
    <div className="doctor-chat-page">
      <div className="doctor-chat-header">
        <button className="doctor-chat-back" onClick={() => navigate('/doctor-dashboard')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2>💬 Farmer Chats</h2>
      </div>

      <div className="doctor-chat-list">
        {loading ? (
          <div className="doctor-chat-empty">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
          </div>
        ) : farmers.length === 0 ? (
          <div className="doctor-chat-empty">
            <span>🌾</span>
            <p>No farmers have contacted you yet.</p>
          </div>
        ) : (
          farmers.map(farmer => (
            <div key={farmer.uid} className="doctor-chat-item" onClick={() => openChat(farmer.uid)}>
              <div className="doctor-chat-item-avatar">🌾</div>
              <div className="doctor-chat-item-info">
                <div className="doctor-chat-item-name">{farmer.name}</div>
                <div className="doctor-chat-item-sub">{farmer.email}</div>
              </div>
              <i className="fas fa-chevron-right doctor-chat-item-arrow"></i>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
