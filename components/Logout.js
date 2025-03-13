'use client'
import React, {useState} from 'react'
import Button from './Button'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ConfirmationDialog from './ConfirmationDialog'


export default function Logout() {
  const {logout, currentUser} = useAuth()
  const pathname = usePathname()
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!currentUser) {
    return null
  }

  if(pathname === '/') {
    return (
      <Link href={'/dashboard'}>
        <Button text="Go to dashboard" />
      </Link>
    )
  }

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const confirmLogout = () => {
    logout(); 
    setShowConfirmation(false); 
  };

  const cancelLogout = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Button text='Logout' clickHandler={handleLogout} />

      {showConfirmation && (
        <ConfirmationDialog
          text="Are you sure you want to log out?"
          onClick={confirmLogout}
          onClose={cancelLogout}
        />
      )}
    </>
  )
}
