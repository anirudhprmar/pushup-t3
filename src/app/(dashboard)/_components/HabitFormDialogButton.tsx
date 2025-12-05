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
  goal: z
    .string()
    .min(5, "Goal must be at least 5 characters."),
  description: z
    .string()
    .optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  habitType: z.enum(["boolean", "numeric", "timer"]).default("boolean"),
  targetValue: z.number().optional(),
  targetUnit: z.string().optional(),
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
      goal: "",
      description: "",
      category: undefined,
      color: "#3b82f6",
      habitType: "boolean",
      targetValue: undefined,
      targetUnit: "",
    },
  })

  const habitType = form.watch("habitType")
  const category = form.watch("category")

  // Update color when category changes
  React.useEffect(() => {
    if (category) {
      form.setValue("color", getDefaultColor(category))
    }
  }, [category, form])

  const trpc = api.useUtils()
  const create = api.habit.create.useMutation({
    onSuccess: async () => {
      await trpc.habit.invalidate()
    }
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const createHabit = await create.mutateAsync({
        name: data.name,
        goal: data.goal,
        description: data.description ?? "",
        category: data.category,
        color: data.color,
        habitType: data.habitType,
        targetValue: data.targetValue,
        targetUnit: data.targetUnit,
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
            <span className="hidden group-hover:inline transition-opacity duration-300">
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
              <Controller
                name="goal"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Goal <span className="text-destructive">*</span>
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
              />

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

              {/* Habit Type */}
              <Controller
                name="habitType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Habit Type</FieldLabel>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          {...field}
                          value="boolean"
                          checked={field.value === "boolean"}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Simple</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          {...field}
                          value="numeric"
                          checked={field.value === "numeric"}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Numeric</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          {...field}
                          value="timer"
                          checked={field.value === "timer"}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Timer</span>
                      </label>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Target Value (conditional) */}
              {(habitType === "numeric" || habitType === "timer") && (
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="targetValue"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Target Value</FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          placeholder="20"
                          aria-invalid={fieldState.invalid}
                        />
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
                        <FieldLabel>Unit</FieldLabel>
                        <Input
                          {...field}
                          placeholder={habitType === "timer" ? "minutes" : "pages, reps..."}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              )}
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
