'use client'
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"

import { authClient } from "~/lib/auth-client"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name:z.string().min(2),
  email:z.string().email()
})

//change the form

export function EmailLoginForm() {
  
  const [loading,setLoading] = useState<boolean>(false)
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name:" "
    },
  })
 
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
   try {
    setLoading(true)
    const { data, error } = await authClient.signIn.magicLink({
    email: values.email, 
    name: "",
    callbackURL: "/dashboard",
    newUserCallbackURL: "/dashboard",
    errorCallbackURL: "/error",
});

  if (data?.status === true) {
      toast.success("Check your mail")
    }

    if(error){
        toast.error(error.message)
    }

    setLoading(false)
   } catch (error) {
    console.log("error in magic link",error)
   }
  }

    

  return (
     <Card className="p-10 w-full max-w-md mx-auto">
           <CardHeader>
             <CardTitle>Signin</CardTitle>
             <CardDescription>
               {/* Help us improve by reporting bugs you encounter. */}
             </CardDescription>
           </CardHeader>
           <CardContent>
             <form id="signinForm" onSubmit={form.handleSubmit(onSubmit)}>
               <FieldGroup>
                 <Controller
                   name="name"
                   control={form.control}
                   render={({ field, fieldState }) => (
                     <Field data-invalid={fieldState.invalid}>
                       <FieldLabel>
                         Name
                       </FieldLabel>
                       <Input
                         {...field}
                         aria-invalid={fieldState.invalid}
                         placeholder="Login button not working on mobile"
                         autoComplete="off"
                       />
                       {fieldState.invalid && (
                         <FieldError errors={[fieldState.error]} />
                       )}
                     </Field>
                   )}
                 />
                  <Controller
                   name="email"
                   control={form.control}
                   render={({ field, fieldState }) => (
                     <Field data-invalid={fieldState.invalid}>
                       <FieldLabel>
                         Email
                       </FieldLabel>
                       <Input
                         {...field}
                         aria-invalid={fieldState.invalid}
                         placeholder="joey@gmail.com"
                         autoComplete="off"
                       />
                       {fieldState.invalid && (
                         <FieldError errors={[fieldState.error]} />
                       )}
                     </Field>
                   )}
                 />
                 
               </FieldGroup>
             </form>
           </CardContent>
           <CardFooter>
             <Field orientation="horizontal">
               <Button type="button" variant="outline" onClick={() => form.reset()}>
                 Reset
               </Button>
               <Button type="submit" form="signinForm" disabled={loading}>
                 {loading ? <Loader2 className="size-4 animate-spin"/> : "Sign Up with email"}
               </Button>
             </Field>
           </CardFooter>
         </Card>
  )
}
