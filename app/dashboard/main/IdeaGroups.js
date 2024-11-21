"use client"

import { StateContext } from '@/app/Context'
import { Button } from '@/components/ui/button'
import { Router } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDialogs } from '@toolpad/core/useDialogs';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
  import { serverTimestamp } from "firebase/firestore";


function IdeaGroups({ user, userData, userGroupData }) {
  const dialogs = useDialogs();
  console.log(userData);
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("")
  const [data, setData] = useState("")
  async function makeGroup() {
    await setDoc(doc(db, "users", user.email, "groups", groupName), {
      name: groupName,
      description: ideaDescription,
      createdAt: serverTimestamp()
    });
    document.getElementById("close-makeGroup").click();
    await dialogs.alert("Group successfully made!");
    router.push("/dashboard/main");
  }

  useEffect(() => {
    if (!user) {
      console.log("Waiting for user...");
    }
  }, [user]);  

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='text-left block w-full p-6'>
      <h1 className='scroll-m-20 mb-10 text-3xl font-extrabold tracking-tight'>Your Idea Groups</h1>
      <div className=''>
        {/* <Button onClick={() => {document.getElementById('idea-groups-main').style.display = "none"}} className='mr-2 w-full mb-4' variant={"secondary"}>Back to Dashboard</Button> */}
        <Dialog>
          <DialogTrigger asChild>
            <div>
              <Button className='mr-2 w-full mb-3' variant={"outline"}>What are idea groups?</Button>
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
            <Button variant={"secondary"} className='w-full'>Make a group</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Make a group</DialogTitle>
            <DialogDescription>You can name your idea group after a project you're working on, or a specific niche you're brainstorming in.</DialogDescription>
            <div className="grid w-full max-w-sm items-center gap-1.5 my-2">
              <Label htmlFor="email">Idea Group Name</Label>
              <Input className='mb-2' onChange={(e) => setGroupName(e.target.value)} placeholder="Ex: Accio Ideas" />
              <Label htmlFor="email">Give it a description</Label>
              <Input onChange={(e) => setIdeaDescription(e.target.value)} placeholder="Ex: List of potential ideas for Accio" />
            </div>
            {/* <Button variant={"secondary"} onClick={makeGroup}>Add</Button>
            <DialogFooter>
              <Button variant={"outline"} id="close-makeGroup">Close</Button>
            </DialogFooter> */}
            <div className='flex justify-between'>
              <Button className='w-28' onClick={makeGroup}>Add</Button>
              <DialogClose asChild>
                <Button variant={"outline"} id="close-makeGroup">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>


      <section>
        {Object.keys(userGroupData).length>0 ? 
        (
          <div className='mt-10 flex gap-4 flex-wrap'>
            {Object.keys(userGroupData).map((idea) => (
              <Card key={idea} className='w-full'>
                <CardHeader>
                  <CardTitle><h1 className='text-2xl'>{userGroupData[idea].name}</h1></CardTitle>
                  <CardDescription>
                    {userGroupData[idea].description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>

                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button className='mr-2'>View Ideas</Button>
                    </DrawerTrigger>
                    <DrawerContent className='p-4 pb-20'>
                      <DrawerHeader>
                        <DialogTitle className='mb-2'>{userGroupData[idea].name}</DialogTitle>
                        <DialogDescription className='mb-2'>{userGroupData[idea].description}</DialogDescription>
                      </DrawerHeader>
                      <div className='flex gap-2'>
                      {Object.keys(userGroupData[idea]).map((ideaGroup) => (
                        ideaGroup.includes("idea_") && (
                          <Card className='w-[30vw]' key={ideaGroup}>
                            <CardHeader>
                              <CardTitle className='mb-2'>{userData[ideaGroup]?.split("|")[0].trim()}</CardTitle>
                              <CardDescription>{userData[ideaGroup]?.split("|")[1].trim()}</CardDescription>
                            </CardHeader>
                          </Card>
                        )
                      ))}
                      </div>
                    </DrawerContent>
                  </Drawer>
                <Button 
                  onClick={async () => {
                    await deleteDoc(doc(db, "users", user.email, "groups", idea));
                    await dialogs.alert("Group successfully deleted");
                    router.push("/dashboard/main");
                  }}
                  variant={"outline"} 
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  Delete group
                </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ):(
          <h1 className='mt-10 text-xl font-bold'>No idea groups made yet!</h1>
        )}
      </section>
    </div>
  ) 
}

export default IdeaGroups;
