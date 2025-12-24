import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminIndex = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to dashboard
    navigate('/admin/dashboard')
  }, [navigate])

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <p className="text-lg text-gray-600">Redirecting to Admin Dashboard...</p>
      </div>
    </div>
  )
}

export default AdminIndex 