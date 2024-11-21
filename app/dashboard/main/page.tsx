"use client";

import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "@/app/Context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Ideas from "./Ideas";
import { deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { DialogsProvider, useDialogs } from '@toolpad/core/useDialogs';
import { useRouter } from "next/navigation";
import IdeaGroups from "./IdeaGroups";
import { serverTimestamp } from "firebase/firestore";

const Page = () => {
  const router = useRouter();
  const dialogs = useDialogs();
  const { user: contextUser, userData, userGroupData } = useContext(StateContext);
  const [user, setUser] = useState(null);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("")
  const [ideaFeatures, setIdeaFeatures] = useState("");
  const [ideaToBeMoved, setIdeaToBeMoved] = useState("");

  const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(
      { length: 5 }, 
      () => chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  };

  async function addIdea() {
    const docRef = doc(db, "users", contextUser.email);
    const docSnap = await getDoc(docRef);
    let l: string[] = [];
    if (docSnap.exists()) {
      l = Object.keys(docSnap.data());
    } else {
      alert("Oops! Look like something went wrong. Please try again!");
    }
    const randID = generateRandomId();
    if(l.includes(randID)) {
      addIdea();
    } else {
      await updateDoc(doc(db, "users", contextUser.email), {
        [`idea_${randID}`]: `${ideaTitle} | ${ideaDescription} | ${ideaFeatures}`
      });
      document.getElementById("close-add-idea")?.click();
      await dialogs.alert("Sounds Fantastic! Idea has been added!")
      router.push("/dashboard/main");
    }
  }

  useEffect(() => {
    setUser(contextUser);
    console.log(contextUser);
  }, [contextUser]);
  
  const today = serverTimestamp();
  const date = new Date();

  const options = { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  } satisfies Intl.DateTimeFormatOptions;
  const formattedDate = date.toLocaleDateString('en-US', options);

  return (
    <div className="p-10 flex items-center justify-center h-screen flex-col text-center">
      <div className="flex items-center justify-center mb-10">
        <h1 className="text-4xl font-bold">
          <span>Your Dashboard</span>
        </h1>
      </div>

      <Dialog>
        <DialogTrigger>
          <div className="hidden" id="success-adding">Success Message for Adding Idea</div>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Sounds fantastic! Idea has been added!</DialogTitle>
        </DialogContent>
      </Dialog>

      <div className="choice flex items-center justify-center">
        <Dialog>
          <DialogTrigger>
            <Card className="mr-4 mb-4 max-w-[197px] transition-all hover:bg-[#1a1a1a] hover:cursor-pointer">
              <CardHeader>
                <CardTitle>Add Ideas</CardTitle>
                <CardDescription>Brainstorm Ideas 🤔</CardDescription>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="mb-2">
              <DialogTitle className="mb-2">What's your idea?</DialogTitle>
              <DialogDescription>
                Ideas can never be stupid. Keep them here as a figment of your creativity, and later build upon it
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
                <Label htmlFor="ideaTitle">Give your idea a name</Label>
                <Input 
                  type="text" 
                  id="ideaTitle" 
                  placeholder="Enter idea title" 
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                />
              </div>
              <div className="grid w-full gap-1.5 mb-4">
                <Label htmlFor="message">Describe your idea</Label>
                <Textarea 
                  // placeholder="I want to build a self-driving burger spaceship...." 
                  id="message" 
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                />
              </div>
              <div className="grid w-full gap-1.5 mb-6">
                <Label htmlFor="features">Key Features?</Label>
                <Input 
                  id="features" 
                  value={ideaFeatures}
                  onChange={(e) => setIdeaFeatures(e.target.value)}
                />
              </div>
              <Button onClick={addIdea}>Add Idea</Button>
            </div>
            <DialogClose>
              <div className="text-left p-2" id="close-add-idea">Close Form</div>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <Card 
          onClick={() => {
            document.getElementById("view-idea-groups")?.click()
          }} 
          className="mb-4 max-w-[197px] transition-all hover:bg-[#1a1a1a] hover:cursor-pointer"
        >
          <CardHeader>
            <CardTitle>Make Groups</CardTitle>
            <CardDescription>Group all Ideas ✨</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="choice flex items-center justify-center">
        <Card className="mr-4 mb-4 max-w-[197px] transition-all hover:bg-[#1a1a1a] hover:cursor-pointer">
          <CardHeader>
            <Dialog>
              <DialogTrigger>
                <CardTitle>Share your Ideas</CardTitle>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader></DialogHeader>
              </DialogContent>
            </Dialog>
            <CardDescription>Let them know what you have in mind 💪🏻</CardDescription>
          </CardHeader>
        </Card>
        <Card className=" mb-4 max-w-[197px] transition-all hover:bg-[#1a1a1a] hover:cursor-pointer">
          <CardHeader>
            <CardTitle>Take Inspiration</CardTitle>
            <CardDescription>Get inspiration from other thinkers👩🏻‍🔧 </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <br/>
      {/* <Separator className="my-0 w-[30%]" /> */}
      {/* <h3 className="mt-4 mb-4">How to use this tool</h3> */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="w-[27vw] mb-4">View your ideas</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your Ideas</SheetTitle>
            <SheetDescription>View and manage your brainstormed ideas</SheetDescription>
          </SheetHeader>
            <div className='ideas-main'>
              {userData && Object.keys(userData).map((key) =>
                key.includes("idea_") ? (
                  <Card key={key} className='p-4 mt-3'>
                    <div className='idea-container'>
                      <h1>{userData[key].split("|")[0].trim()}</h1>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant={"secondary"} className='mt-4' size="sm">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <Button
                          className='mt-4 ml-2'
                          size="sm"
                          onClick={async () => {
                            if (contextUser?.email) {
                              updateDoc(doc(db, "users", contextUser.email), {
                                [key]: deleteField(),
                              });
                              await dialogs.alert("Idea has been deleted!");
                              router.push("/dashboard/main");
                            } else {
                              console.error("contextUser.email is undefined");
                            }
                          }}
                          variant={"outline"}
                        >
                          Delete
                        </Button>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{userData[key].split("|")[0].trim()}</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            {userData[key].split("|")[1].trim()}
                          </DialogDescription>
                          <h1 className='scroll-m-20 text-sm font-semibold tracking-tight'>
                            Features
                          </h1>
                          <p className='scroll-m-20 text-sm'>
                            {userData[key].split("|")[2].trim()}
                          </p>
                          <DialogFooter>
                            <Button variant={"outline"} onClick={() => {
                              setIdeaToBeMoved(key);
                              document.getElementById("move-idea-trigger")?.click();
                            }}>Move to an idea group</Button>
                          </DialogFooter>
                        </DialogContent>
                        <DialogClose asChild hidden>
                          <Button id="close-view-idea" type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                      </Dialog>
                    </div>
                  </Card>
                ) : null
              )}
            </div>
        </SheetContent>
        <SheetClose asChild hidden>
          <Button id="close-view-ideas" type="button" variant="secondary">
            Close
          </Button>
        </SheetClose>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <Button id="view-idea-groups" className="w-[27vw]" variant={"secondary"}>View your idea groups</Button>
        </SheetTrigger>
        <SheetContent className="p-4">
          <SheetTitle></SheetTitle>
          <IdeaGroups user={contextUser} userData={userData} userGroupData={userGroupData}/>
        </SheetContent>
      </Sheet>

      <Dialog>
        <DialogTrigger asChild hidden>
          <div id="move-idea-trigger">This is the trigger for moving an idea to a group</div>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle></DialogTitle>
          {Object.keys(userGroupData).length>0 ? 
          (
            <section>
              <DialogContent className="p-6 pt-10">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Choose which group to move your idea to
                  </DialogTitle>
                </DialogHeader>
                {Object.keys(userGroupData).map((group) => (
                  <Card key={group}>
                    <CardHeader>
                      <CardTitle>{group}</CardTitle>
                      <CardDescription>
                        {userGroupData[group].description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(userData).includes(ideaToBeMoved) ? 
                      (
                        <Button disabled variant={"secondary"}>Already in this group</Button>
                      ):(
                        <Button onClick={async () => {
                          try {
                            await updateDoc(doc(db, "users", contextUser.email, "groups", group), {
                              [ideaToBeMoved]: ideaToBeMoved,
                            });
                            document.getElementById("close-select-group")?.click();
                            document.getElementById("close-view-ideas")?.click();
                            await dialogs.alert("Idea has been moved!");
                            router.push("/dashboard/main");
                          } catch(err) {
                            await dialogs.alert("Error occured. Please try again!");
                          }
                        }}>Move</Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
                <DialogClose asChild hidden>
                  <Button id="close-select-group" type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogContent>
            </section>
          ):(
            <DialogHeader>
              <DialogDescription>
                You have no idea groups to move your idea into. When you have created an idea group, you can come back here to move this idea into it!
              </DialogDescription>
            </DialogHeader>
          )}
        </DialogContent>
      </Dialog>

      <div className="fixed top-10 left-6 text-left">
      <Button variant={"outline"} className="mb-4">How to use this tool</Button><br/>
      <Button variant={"outline"}>Contact us</Button>
      </div>
      {/* <Separator className="my-0 w-[30%]" /> */}
    </div>
  );
};

export default Page;