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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import {
  InputGroup,
  InputGroupTextarea,
} from "~/components/ui/input-group"


import { authClient } from "~/lib/auth-client"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name:z.string().min(2),
  email:z.string().email()
})

//modify the form

export function EmailSignupForm() {
  
  const [loading,setLoading] = useState<boolean>(false)
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name:"",
      email: "",
    },
  })
 
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
   try {
    setLoading(true)
    const { data, error } = await authClient.signIn.magicLink({
    email: values.email, 
    name: values.name,
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
     <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            {/* Help us improve by reporting bugs you encounter. */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signupForm" onSubmit={form.handleSubmit(onSubmit)}>
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
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        placeholder="I'm having an issue with the login button on mobile."
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>
                    <FieldDescription>
                      Include steps to reproduce, expected behavior, and what
                      actually happened.
                    </FieldDescription>
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
            <Button type="submit" form="signupForm" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin"/> : "Sign Up with email"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
  )
}
