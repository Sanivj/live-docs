'use client'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React, { useEffect, useRef, useState } from 'react'
import { RoomProvider,ClientSideSuspense } from '@liveblocks/react/suspense'
import ActiveCollaborators from './ActiveCollaborators'
import { Input } from './ui/input'
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/room.actions'
import Loader from './Loader'
import ShareModal from './ShareModal'
type CollaborativeRoomProps = {
  roomId: string;
  roomMetaData: any; 
  users:any[];
  currentUserType: UserType;
};

const CollaborativeRoom = ({roomId,roomMetaData,users,currentUserType}:CollaborativeRoomProps) => {
  const [editing,setEditing]=useState(false)
  const [loading,setLoading]=useState(false)
  const [documentTitle,setDocumentTitle]=useState(roomMetaData.title)

  const containerRef=useRef<HTMLDivElement>(null)
  const inputRef=useRef<HTMLInputElement>(null)

  const updateTitleHandler=async(e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==='Enter'){
      setLoading(true)
      try {
        if(documentTitle!==roomMetaData.title){
          const updatedDocument=await updateDocument(roomId,documentTitle)
          if(updatedDocument){
            setEditing(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }
  }

  useEffect(()=>{
    const handleClickOutside=(e:MouseEvent)=>{
      if(containerRef.current&&!containerRef.current.contains(e.target as Node)){
        setEditing(false)
        updateDocument(roomId, documentTitle);
      }
    }
    document.addEventListener('mousedown',handleClickOutside)
    return()=>{
      document.removeEventListener('mousedown',handleClickOutside)
    }
  },[roomId, documentTitle])

  useEffect(()=>{
    if(editing&&inputRef.current){
      inputRef.current.focus()
    }
  },[editing])

  return (
    <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader/>}>
          <div className='flex size-full max-h-screen flex-1 flex-col items-center overflow-hidden'>
            <Header>
            <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
                {editing&&!loading?(
                  <Input
                  type='text'
                  value={documentTitle}
                  ref={inputRef}
                  placeholder='Enter Title'
                  onChange={(e)=>setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  disabled={!editing}
                  className=' min-w-[78px] flex-1 border-none bg-transparent px-0 text-left text-base font-semibold leading-[24px] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:text-black sm:text-xl md:text-center !important'
                  />
                ):(
                  <>
                    <p className='line-clamp-1 border-dark-400 text-base font-semibold leading-[24px] sm:pl-0 sm:text-xl'>{documentTitle}</p>
                  </>
                )}+
                {currentUserType==='editor'&&!editing&&(
                  <Image
                  src="/assets/icons/edit.svg"
                  alt='edit'
                  width={24}
                  height={24}
                  onClick={()=>setEditing(true)}
                  className="pointer"
                  />
                )}
                {currentUserType!=='editor'&&!editing&&(
                  <p className='rounded-md bg-dark-400/50 px-2 py-0.5 text-xs text-blue-100/50'>
                    View Only
                  </p>
                )}
                {loading&&<p className='text-sm text-gray-100'>saving...</p>}
            </div>
            <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
              <ActiveCollaborators/>
              <ShareModal
                roomId={roomId}
                collaborators={users}
                creatorId={roomMetaData.creatorId}
                currentUserType={currentUserType}
              />
              <SignedOut>
                <SignInButton />  
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            
        </Header>
        <Editor roomId={roomId} currentUserType={currentUserType}/>
          </div>
        </ClientSideSuspense>
      </RoomProvider>
  )
}

export default CollaborativeRoom