'use client'
import { Fugaz_One } from 'next/font/google';
import React, {useState, useEffect} from 'react'
import Button from './Button';
import { useAuth } from '@/context/AuthContext';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] })

export default function ResetPassword({backToLogin}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const {resetPassword} = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    try{
      await resetPassword(email)
      setSuccess(true)
    } catch(err) {
      setError(err.message)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        backToLogin()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, backToLogin])


  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-6">
      <h2 className={`text-3xl sm:text-4xl ${fugaz.className}`}>Reset Password</h2>

      { success ? (
        <div className="text-center">
          <p className="text-green-500 mb-4">Password reset email sent!</p>
          <p className="mb-4">Check your inbox for further instructions.</p>

          <Button
            clickHandler={backToLogin}
            text="Login"
          />
        </div> 
      ): (
        <>
          <p className="text-center">Enter your email to receive a reset link</p>
          <form onSubmit={submit} className=" flex flex-col gap-4">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              required
              className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600  py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none'
            />
             {/* Error Message */}
              {error && (
                  <p className='text-red-500 text-sm text-center max-w-[400px] w-full'>
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  text={loading ? "Sending..." : "Send Reset Link"}
                  disabled={loading}
                />
                <button onClick={backToLogin} className='text-indigo-600'>Sign in</button>
              </div>
          </form>
        </>
      )}
    </div>
  )

}