"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

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
import { HABIT_CATEGORIES, getDefaultColor } from "~/lib/habitUtils"
import { ColorPicker } from "~/components/ui/colorPicker"

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Habit name must be at least 3 characters.")
    .max(50, "Habit name must be at most 50 characters."),
  goalId: z.uuid().optional(),
  description: z
    .string()
    .optional(),
  category: z.string().optional(),
  color: z.string().optional(),
})

import { PlusIcon } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

export function HabitForm() {
  const [open, setOpen] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      goalId:undefined,
      description: "",
      category: undefined,
      color: "#3b82f6",
    },
  })


  const category = form.watch("category")

  // Update color when category changes
  React.useEffect(() => {
    if (category) {
      form.setValue("color", getDefaultColor(category))
    }
  }, [category, form])

  const trpc = api.useUtils()
  const create = api.habits.createHabit.useMutation({
    onSuccess: async () => {
      await trpc.habits.invalidate()
    }
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const createHabit = await create.mutateAsync({
        name: data.name,
        goalId: data.goalId,
        description: data.description ?? "",
        category: data.category,
        color: data.color
      })

      if (createHabit) {
        toast("Habit created successfully!", {
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
      console.log("error in adding habit", error)
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
              Create New Habit
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
            <DialogDescription>
              Create and commit to your habits with detailed tracking
            </DialogDescription>
          </DialogHeader>
          <form id="habit-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Name */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Habit Name <span className="text-destructive">*</span>
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

              {/* Goal */}
              {/* <Controller
                name="goalId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      GoalId <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Build consistency, improve health..."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
                /> */}
                {/* give a list of all goals and user will choose and we will send that goal's id to this */}

              {/* Description */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Description</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        placeholder="I'm doing this because..."
                        rows={3}
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

              {/* Category */}
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select a category</option>
                      {HABIT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Color */}
              <Controller
                name="color"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Color</FieldLabel>
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

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
