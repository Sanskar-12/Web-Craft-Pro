import { verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const Agency = async() => {

  const agencyId=await verifyAndAcceptInvitation()
  console.log(agencyId)
  
  return (
    <div>Agency</div>
  )
}

export default Agency