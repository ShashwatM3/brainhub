"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";
import NumberTicker from "@/components/ui/number-ticker";
import "../styles.css";
import {setDoc, doc} from "firebase/firestore";
import {db} from "../../firebase";

const Page = () => {

  const router = useRouter();
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    setFirebaseInitialized(true);
  }, []);

  async function signUp() {
    if (!firebaseInitialized) return;

    const loadingElement = document.getElementById("loading");
    const emailElement = document.getElementById("email") as HTMLInputElement;
    const nameElement = document.getElementById("name") as HTMLInputElement;
    const passwordElement = document.getElementById("password") as HTMLInputElement;
    const obj = {
      "email": emailElement.value,
      "name": nameElement.value,
      "password": passwordElement.value,
    }
    
    if (!loadingElement || !emailElement) {
      console.error("Required elements not found");
      return;
    }
    const email = emailElement.value;

    try {
      // Import and initialize Firebase first
      await setDoc(doc(db, "users", email), obj);
    } catch (error) {
      console.error("Error signing up:", error);
      loadingElement.style.display = "none";
    }

    loadingElement.style.display = "flex";

    setTimeout(() => {
      loadingElement.style.display = "none";
    }, 1000);
  }

  return (
    <div className="flex h-screen items-center justify-center w-screen">
      <Card className="w-[27vw] p-4">
        <CardHeader>
          <CardTitle className="text-4xl text-center">Sign into your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 mb-2">
                <Label htmlFor="name">Name/Email Address</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Preferred Password</Label>
                <Input type="password" id="password" placeholder="XXXXX" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/')}>Cancel</Button>
          <Button onClick={signUp}>Sign in</Button>
        </CardFooter>
      </Card>
      <p id="loading" className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-black dark:text-white h-[100vh] z-20 fixed bg-black w-full flex items-center justify-center">
        <NumberTicker value={100} />
      </p>
    </div>
  )
}

export default Page