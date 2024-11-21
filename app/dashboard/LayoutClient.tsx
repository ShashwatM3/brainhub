"use client"

import { StateContext } from '@/app/Context';
import { Button } from '@/components/ui/button';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, DocumentData, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { DialogsProvider } from '@toolpad/core/useDialogs';

export default function LayoutClient({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [userGroupData, setUserGroupData] = useState({});
  let user: { email: string; } | null = null;
  
  if (typeof window !== 'undefined') {
    user = JSON.parse(localStorage.getItem("username brainstorming app") ?? "null");
  }

  useEffect(() => {
    async function getData() {
      if(user && user.email) {
        const docRef = await getDoc(doc(db, "users", user.email));
        if(docRef.exists()) {
          setUserData(docRef.data())
        }
        const dRef = await getDocs(collection(db, "users", user.email, "groups"))
        dRef.forEach((d) => {
          setUserGroupData(prev => ({...prev, [d.id]: d.data()}))
        })
      }
    }
    getData();
  }, [])

  if (!user) {
    return (
      <div className='p-10 flex items-center justify-center h-screen flex-col text-center'>
        <div className="flex items-center justify-center mb-10">
          <div className='text-xl'>You have not logged in yet</div>
        </div>
        <div className='flex gap-4'>
          <Button onClick={() => router.push('/sign-up')}>Sign up</Button>
          <Button onClick={() => router.push('/sign-in')} variant={"secondary"}>Login</Button>
        </div>
      </div>
    )
  }

  return (
    <DialogsProvider>
      <StateContext.Provider value={{user, userData, userGroupData}}>
        {children}
      </StateContext.Provider>
    </DialogsProvider>
  )
}