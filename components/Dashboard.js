'use client'
import { Fugaz_One } from 'next/font/google';
import React, {useEffect, useState} from 'react'
import Calendar from './Calendar';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Loading from './Loading';
import Login from './Login';
import { gradients } from '@/utils';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Dashboard() {
  const {currentUser, userDataObj, setUserDataObj, loading} = useAuth()
  const [data, setData] = useState({})
  const [updateMood, setUpdateMood] = useState(false)
  const now = new Date()

  function countValues() {
    if (!data || !data.moods) {
      return {
        num_days: 0,
        average_mood: '0'
      };
    }

    let total_number_of_days = 0
    let sum_moods = 0
    
    for (let year in data.moods) {
      for (let month in data.moods[year]) {
        for (let day in data.moods[year][month]) {
          let days_mood = data.moods[year][month][day]
          if (!isNaN(days_mood)) {
            total_number_of_days++;
            sum_moods += days_mood;
          }
        }
      }
    }
    return {
      num_days: total_number_of_days, 
      average_mood: total_number_of_days > 0 ? (sum_moods / total_number_of_days).toFixed(1) : '0'
    }
  }

  const statuses = {
    ...countValues(),
    time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
    
  }

  async function handleSetMood(mood) {
    
    const day = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()

    setUpdateMood(true)
    try {
      const newData = {
        ...userDataObj,
        moods: {
          ...userDataObj.moods,
          [year]: {
            ...userDataObj.moods?.[year],
            [month]: {
              ...userDataObj.moods?.[year]?.[month],
              [day]: mood
            }
          }
        }
      };
  
      // newData.moods[year][month][day] = mood
       // update the current state
      setData(newData)
      // update the global state
      setUserDataObj(newData)
      // update firebase
      const docRef = doc(db, 'users', currentUser.uid)
      await setDoc(docRef, newData )
    } catch(err) {
      console.log('failed to set data: ', err.message)
    } finally {
      setUpdateMood(false)
    }
   

  }

  const moods = {
    '&*@#$': '😭',
    'Sad': '😥',
    'Existing': '😶',
    'Good': '☺️',
    'Elated': '😍',
  }

  const moodColors = {
    1: gradients.pink[0],
    2: gradients.pink[1],
    3: gradients.pink[2],
    4: gradients.pink[3],
    5: gradients.pink[4],
  }

  useEffect(() => {
    if(!currentUser || !userDataObj) {
      return
    }
    setData(userDataObj)
  }, [currentUser, userDataObj])

  if(loading) {
    return <Loading/>
  }

  if(!currentUser) {
    return <Login/>
  }

  return (
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
      <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg '>
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className=' flex flex-col gap-1 sm:gap-2'>
              <p className='font-medium capitalize text-xs sm:text-sm truncate ' >{status.replaceAll('_', ' ')}</p>
              <p className={'text-base sm:text-lg truncate ' + fugaz.className}>{statuses[status]}{status === 'num_days' ? ' 🔥' : ' '}</p>
            </div>
          )
        })}
      </div>
      <h4 className={'text-5xl sm:text-6xl md:7xl text-center ' + fugaz.className}>
        How do you <span className='textGradient'>feel</span> today?
      </h4>
      <div className='flex items-stretch flex-wrap gap-4'>
        {Object.keys(moods).map((mood, moodIndex) => {
          const currentMoodValue = moodIndex + 1
          const buttonColor = moodColors[currentMoodValue]
          return (
            <button onClick={() => { 
              handleSetMood(currentMoodValue)
            }} className={'p-4 px-5 rounded-2xl purpleShadow duration-200 text-center flex flex-col items-center gap-2 flex-1 ' } style={{ backgroundColor: buttonColor  }} key={moodIndex}>
              <p className='text-4xl sm:5xl md:6xl '>{moods[mood]}</p>
              <p className={'mood-text-outline text-indigo-700 text-xs sm:text-sm md:text-base ' + fugaz.className}>{mood}</p>
            </button>
          )
        })}
      </div>
      <Calendar completeData={data.moods} handleSetMood={handleSetMood} />
    </div>
  )
}
