"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  InputGroup,
  InputGroupInput,
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


import { PlusIcon } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

const formSchema = z.object({
  task: z
    .string()
    .min(3, "Task name must be at least 3 characters.")
    .max(50, "Task name must be at most 50 characters."),
  habitId: z.string().optional(),
  targetValue:z.coerce.number(),
  targetUnit:z.string()
})

export function TaskForm() {
  const [open, setOpen] = React.useState(false)
 
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
     habitId: undefined,
     task: "",
     targetValue: undefined,
     targetUnit:""
    },
  })

  const {data:userHabits,isLoading,error} = api.habits.all.useQuery()

  if(isLoading){
    console.log("loading habits for task form")
  }

  if(error){
    console.log("error in fetching habits for task form", error)
  }

  

  const trpc = api.useUtils()
  const create = api.tasks.createNewTask.useMutation({
    onSuccess: async () => {
      await trpc.tasks.invalidate()
    }
  })
  //habitId : links tasks to that habit, if that task related to that habit is completed then we can use that to update habit log with completed true.
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const createTask = await create.mutateAsync({
        habitId: data.habitId === "" ? undefined : data.habitId,
        task: data.task,
        targetValue:data.targetValue,
        targetUnit:data.targetUnit
      })

      if (createTask) {
        toast("Task created successfully!", {
          position: "bottom-right",
          classNames: {
            content: "flex flex-col gap-2",
          },
          style: {
            "--border-radius": "calc(var(--radius) + 4px)",
          } as React.CSSProperties,
        })
        form.reset()
        setOpen(false)
      }
    } catch (error) {
      console.log("error in creating task", error)
      if (create.isError) {
        toast(`${create.error.message}`)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="flex items-center justify-center group-hover:justify-start gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-all overflow-hidden whitespace-nowrap"
          >
            <PlusIcon className="shrink-0 h-5 w-5" />
            <span className="group-hover:inline transition-opacity duration-300">
              New Task
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <form id="habit-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>

              <Controller
                name="task"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Task Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g., Read 20 pages, solve math problems, watch anime..."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="habitId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Link task with your habit</FieldLabel>
                  <Select defaultValue="null" onValueChange={field.onChange}>
                    <SelectTrigger id="checkout-7j9-exp-year-f59">
                      <SelectValue placeholder="Reading, Math..." />
                    </SelectTrigger>
                    <SelectContent>
                      {userHabits?.map((habit) =>(
                        <SelectItem key={habit.id} value={habit.id}>{habit.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
                />

              {/* Target */}
              <div className="flex items-start justify-center gap-3 ">
                <Controller
                  name="targetValue"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Target Value</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          placeholder="e.g. 10 min, 20 pages"
                          className="min-h-20 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="targetUnit"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Target Unit</FieldLabel>
                    <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          placeholder="e.g. min, pages, km"
                          aria-invalid={fieldState.invalid}
                        />
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

            </FieldGroup>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="habit-form" disabled={create.isPending}>
              {create.isPending ? "Creating..." : "Create Habit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
