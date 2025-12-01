"use client"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

import {
  InputGroup,
  InputGroupTextarea,
} from "~/components/ui/input-group"
import { Button } from "~/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { api } from "~/lib/api"


const formSchema = z.object({
  name: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  goal:z
    .string()
    .min(5, "Goal must be at least 5 characters."),
  description: z
    .string()
    .optional()
})


export function HabitForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      goal:"",
      description: "",
    },
  })
//   const queryClient = useQueryClient()

//   const { mutate: create, isPending } = useMutation({
//     mutationFn: async ({ name,goal,description }: { name: string,goal:string,description:string }) => {
//       const res = await client.habit.createNew.$post({name,goal,description,userId:"Wxk9BvCUI2LJ29BgDDoawezMdwfMrK9P"})
//       return await res.json()
//     },
//     onSuccess: async () => {
//       await queryClient.invalidateQueries({ queryKey: ["get-user-habits"] })
//     },
//   })

  const trpc = api.useUtils()
  const create = api.habit.create.useMutation({
    onSuccess:async()=>{
      await trpc.habit.invalidate()
    }
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
        const createHabit = await create.mutateAsync({
            name:data.name,
            goal:data.goal,
            description:data.description ?? "",
            userId:"Wxk9BvCUI2LJ29BgDDoawezMdwfMrK9P"
        })
    
        if (createHabit) {
            toast("Habit created successfully!", {
              // type: "success",
              position: "bottom-right",
              classNames: {
                content: "flex flex-col gap-2",
              },
              style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
              } as React.CSSProperties,
            })
            form.reset()
          }
    } catch (error) {
      console.log("error in adding word",error)
        if (create.isError) {
          toast(`${create.error.message}`)
        }
    }
  }
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Create Habit</CardTitle>
      </CardHeader>

      <CardContent>
        <form id="habit-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="Meditation, Exercise, Reading..."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
              <Controller
              name="goal"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Goal
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Meditation, Exercise, Reading..."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      placeholder="I'm doing this because i love it..."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    {/* <InputGroupAddon align="block-end"> */}
                      {/* <InputGroupText className="tabular-nums"> */}
                        {/* {field.value.length} characters */}
                      {/* </InputGroupText> */}
                    {/* </InputGroupAddon> */}
                  </InputGroup>
                  
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
          {/* <Button type="button" variant="outline" onClick={() => }>
            Cancel
          </Button> */}
          <Button type="submit" form="habit-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}