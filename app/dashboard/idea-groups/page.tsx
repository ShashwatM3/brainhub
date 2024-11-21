"use client"

import { StateContext } from '@/app/Context'
import { Button } from '@/components/ui/button'
import { Router } from 'lucide-react'
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';

const Page = () => {
  const {contextUser, userData} = useContext(StateContext);
  console.log(userData);
  const router = useRouter();
  async function makeGroup() {
    console.log(contextUser);
    const docRef = await getDocs(collection(db, "users", contextUser, "groups"));
    console.log(docRef);
  }

  useEffect(() => {
    if (!contextUser) {
      console.log("Waiting for contextUser...");
    }
  }, [contextUser]);  

  if (!contextUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-12 pt-14'>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>Your Idea Groups</h1>
      <div className='flex'>
        <Button onClick={() => {router.push("/dashboard/main")}} className='mt-8 mr-2' variant={"secondary"}>Back to Dashboard</Button>
        <Dialog>
          <DialogTrigger asChild>
            <div>
              <Button className='mt-8 mr-2' variant={"outline"}>What are idea groups?</Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>What are Idea groups?</DialogTitle>
            <DialogDescription>
              You can classify your ideas into specific groups or different projects you are working on
            </DialogDescription>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='mt-8'>Make a group</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Make a group</DialogTitle>
            <DialogDescription>You can name your idea group after a project you're working on, or a specific niche you're brainstorming in.</DialogDescription>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Idea Group Name</Label>
              <Input type="email" id="email" placeholder="Ex: Accio Ideas" />
            </div>
            <DialogFooter>
              <Button onClick={makeGroup}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>


      <section>
        {userData?.ideaGroups?.length > 0 ? (
          <div>Your groups will appear here</div>
        ) : (
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
            No Groups made yet
          </h1>
        )}
      </section>
    </div>
  ) 
}

export default Page