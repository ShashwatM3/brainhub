import { StateContext } from '@/app/Context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React, { useContext, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { doc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '@/app/firebase';
function Ideas() {
  const { userData, contextUser } = useContext(StateContext);

  useEffect(() => {
    console.log("contextUser:", contextUser);
  }, [contextUser]);

  if (!contextUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className='ideas-main'>
      {Object.keys(userData).map((key) =>
        key.includes("idea_") ? (
          <Card key={key} className='p-4 mt-3'>
            <div className='idea-container'>
              <h1>{userData[key].split("|")[0].trim()}</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"outline"} className='mt-4' size="sm">
                    View Details
                  </Button>
                </DialogTrigger>
                <Button
                  className='mt-4 ml-2'
                  size="sm"
                  onClick={() => {
                    if (contextUser?.email) {
                      updateDoc(doc(db, "users", contextUser.email), {
                        [`idea_${key}`]: deleteField(),
                      });
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
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ) : null
      )}
    </div>
  );
}

export default Ideas;
