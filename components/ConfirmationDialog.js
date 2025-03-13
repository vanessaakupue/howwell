import React, { useRef, useEffect } from 'react'
import Button from './Button'


export default function ConfirmationDialog(props) {
  const { text, onClick, onClose } = props

  const dialogRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose(); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose])

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
      <div ref={dialogRef} className="max-w-[90%] mx-4 sm:max-w-md duration-200 bg-white px-6 py-10 rounded-lg shadow-lg text-center">
        <p className="text-lg mb-4">{text}</p>
        <div className="flex justify-center gap-4">
          <Button
            text="Yes"
            clickHandler={onClick}
            dark
          />
            
          <Button
            text="No"
            clickHandler={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          />
            
        </div>
      </div>
    </div>
  )
}
