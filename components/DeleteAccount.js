'use client';
import React, { useState } from 'react';
import Button from './Button';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import ConfirmationDialog from './ConfirmationDialog';

export default function DeleteAccount() {
  const { deleteAccount, currentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!currentUser) {
    return null;
  }

  if (!currentUser || pathname === '/') {
    return null;
  }

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAccount(); // Delete the account
      router.push('/'); // Redirect to the home page after deletion
    } catch (err) {
      console.log('Error deleting account: ' + err.message);
    } finally {
      setShowConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Button dark text="Delete Account" clickHandler={handleDeleteClick} />

      {showConfirmation && (
        <ConfirmationDialog
          text="Are you sure you want to delete your account? This action cannot be undone."
          onClick={confirmDelete}
          onClose={cancelDelete}
        />
      )}
    </>
  );
}