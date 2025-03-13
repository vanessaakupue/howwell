'use client'
import { Fugaz_One } from 'next/font/google';
import React, {useState} from 'react'
import Button from './Button';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/error';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [Authenticating, setAuthenticating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const {signup, login } = useAuth()

  const resetForm = () => {
    setIsRegister(!isRegister)
    setEmail('')
    setPassword('')
    setError('')
  }

  async function handleSubmit() {
    if(!email || !password ) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 7) {
      setError('Password must be at least 7 characters long.')
      return
    }

    setAuthenticating(true)
    setError('')

    try {
      if(isRegister) {
        await signup(email, password)
      } else {
        await login(email, password)
      }
    } catch(err) {
      setError(getErrorMessage(err.code))
    } finally {
      setAuthenticating(false)
    }
  }

  return (
    <div className='flex flex-col flex-1 justify-center items-center gap-4'>
      <h3 className={'text-4xl sm:text-5xl md;text-6xl ' + fugaz.className}>{ isRegister ? 'Register' :  'Log In'}</h3>
      <p>You&#39;re one step away!</p>

      <input value={email} onChange={(e) => {
        setEmail(e.target.value)
        setError('')
      }} className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600  py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Email' type="text" />

      <div className='relative w-full max-w-[400px] mx-auto'>
        <input value={password} onChange={(e) => {
        setPassword(e.target.value)
        setError('')
        }} className='w-full px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600  py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Password' type={ showPassword ? "text" : "password"}  />
        <button onClick={() => setShowPassword(!showPassword)}
          className='absolute right-5 top-3'>
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

       {/* Error Message */}
       {error && (
        <p className='text-red-500 text-sm text-center max-w-[400px] w-full'>
          {error}
        </p>
      )}
      
      <div className='max-w-[400px] w-full mx-auto'>
        <Button clickHandler={handleSubmit} text={ Authenticating ? "Submitting" : "Submit"} full/>
      </div>
      <p className='text-center'>{ isRegister ? 'Already have an account? ' : 'Don\'t have an account? '} <button onClick={resetForm} className='text-indigo-600'>{ isRegister ? 'Sign in' : 'Sign Up'}</button></p>
    </div>
  )
}
