"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import {StateContext} from "./Context";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const signUp = () => {
    router.push('/sign-up');
  };
  
  const signIn = () => {
    router.push('/sign-in');
  };

  const [user, setUser] = useState();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem("username brainstorming app") || "{}");
      console.log(user);
      setUser(user);
      if(Object.keys(user).length > 0) {
      console.log(user);
        router.push('/dashboard/main');
      }
    }
  }, []);

  return (
    <StateContext.Provider value={{user, setUser}}>
      <div className="flex h-screen items-center justify-center w-screen">
        <div className="w-[25vw] text-center">
          <h1 className="font-bold text-7xl">BrainHub</h1>
          <h3 className="my-4 text-xl opacity-60">All your brainstorming in one place, ready for you to execute and grow</h3>
          <Button onClick={signUp} className="mr-2">Get Started</Button>
          <Button onClick={signIn} variant={"secondary"}>Sign in</Button>
        </div>
      </div>
    </StateContext.Provider>
  );
}
