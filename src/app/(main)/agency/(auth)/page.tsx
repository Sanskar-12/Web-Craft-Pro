import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const Agency = async() => {

  const authUser=await currentUser()
  console.log(authUser)

  if(!authUser)
    {
      redirect("/sign-in")
    }

  return (
    <div>Agency</div>
  )
}

export default Agency