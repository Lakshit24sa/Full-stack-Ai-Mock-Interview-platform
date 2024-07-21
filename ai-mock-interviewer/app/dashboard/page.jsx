import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddnewInterview from './_components/AddnewInterview'
import InterviewList from './_components/InterviewList'
function Dashboard() {
  return (
    <div>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h2 className='text-gray-500'> Create and start your mock interview</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddnewInterview/> 
      </div>
      <InterviewList/>
    </div>
  )
}

export default Dashboard
