import AddDocumentBtn from '@/components/AddDocumentBtn'
import { DeleteModal } from '@/components/DeleteModal'
import Header from '@/components/Header'
import Notifications from '@/components/Notifications'
import { Button } from '@/components/ui/button'
import { getDocuments } from '@/lib/actions/room.actions'
import { dateConverter } from '@/lib/utils'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const Home = async() => {
  const clerkUser=await currentUser();
  if(!clerkUser){
    redirect('sign-in')
  }
  const roomDocuments=await getDocuments(clerkUser.emailAddresses[0].emailAddress)
  return (
    <main className='relative flex min-h-screen w-full flex-col items-center gap-5 sm:gap-10'>
      <Header className='sticky left-0 top-0'>
        <div className='flex items-center gap-2 lg:gap-4'>
          <Notifications/>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </div>
      </Header>
      {roomDocuments.data.length>0?(
        <div className='flex flex-col items-center mb-10 w-full gap-10 px-5'>
          <div className='max-w-[730px] flex w-full justify-between items-center'>
            <h3 className='text-white text-xl font-semibold'>All Documents</h3>
            <AddDocumentBtn
               userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}/>
          </div>
          <ul className="flex flex-col gap-4 w-full items-center">
            {roomDocuments.data.map(({id,metadata,createdAt}:any)=>(
              <li key={id} className='w-full flex max-w-[730px] bg-card rounded-xl px-5 py-4 hover transition'>
                <Link href={`/documents/${id}`} className='flex flex-1 items-center gap-4'>
                  <div className='hidden rounded-md bg-dark-500 p-2 sm:block'>
                    <Image
                      src="/assets/icons/doc.svg"
                      alt='file'
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <p className='line-clamp-1 text-white text-base font-medium'>{metadata.title}</p>
                    <p className='text-xs text-gray-400'>Created about {dateConverter(createdAt)}</p>
                  </div>
                </Link>
                <DeleteModal roomId={id}/>
              </li>
            ))}
          </ul>
        </div>
      ):(
        <div className='flex w-full max-w-[730px] flex-col items-center justify-center gap-5 rounded-lg bg-dark-200 px-10 py-8'>
          <Image
          src="/assets/icons/doc.svg"
          alt='document'
          width={40}
          height={40}
          className='mx-auto'/>
          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  )
}

export default Home