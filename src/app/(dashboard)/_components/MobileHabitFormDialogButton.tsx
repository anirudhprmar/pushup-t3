"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  InputGroup,
  InputGroupTextarea,
} from "~/components/ui/input-group";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { api } from "~/lib/api";

import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";


const formSchema = z.object({
  name: z
    .string()
    .min(3, "Habit name must be at least 3 characters.")
    .max(32, "Habit name must be at most 32 characters."),
  goal: z.string().min(5, "Goal must be at least 5 characters."),
  description: z.string().optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  habitType: z.enum(["boolean", "numeric", "timer"]),
  targetValue: z.number().optional(),
  targetUnit: z.string().optional(),
});

export function MobileHabitForm() {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      goal: "",
      description: "",
      category: "",
      color: "#3b82f6",
      habitType: "boolean",
      targetValue: undefined,
      targetUnit: "",
    },
  });

  const habitType = form.watch("habitType");

  const trpc = api.useUtils();
  const create = api.habit.create.useMutation({
    onSuccess: async () => {
      await trpc.habit.invalidate();
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const createHabit = await create.mutateAsync({
        name: data.name,
        goal: data.goal,
        description: data.description,
        category: data.category,
        color: data.color,
        habitType: data.habitType,
        targetValue: data.targetValue,
        targetUnit: data.targetUnit,
      });

      if (createHabit) {
        toast("Habit created successfully!", {
          position: "bottom-right",
          classNames: {
            content: "flex flex-col gap-2",
          },
          style: {
            "--border-radius": "calc(var(--radius)  + 4px)",
          } as React.CSSProperties,
        });
        form.reset();
        setIsOpen(false);
      }
    } catch (error) {
      console.log("error in adding habit", error);
      if (create.isError) {
        toast(`${create.error.message}`);
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground"
          >
            <PlusIcon className="h-6 w-6" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>
            Create and commit to your habits
          </DialogDescription>
        </DialogHeader>
        <form id="mobile-habit-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
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
                  <FieldLabel>Goal</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Daily consistency, 30 minutes..."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="category"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Category (Optional)</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Learning">Learning</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Productivity">Productivity</SelectItem>
                      <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="Social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="habitType"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Habit Type</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boolean">Simple Check (Yes/No)</SelectItem>
                      <SelectItem value="numeric">Numeric Goal (Reps, Pages, etc.)</SelectItem>
                      <SelectItem value="timer">Timer-based (Minutes, Hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {(habitType === "numeric" || habitType === "timer") && (
              <>
                <Controller
                  name="targetValue"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Target Value</FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        aria-invalid={fieldState.invalid}
                        placeholder="20, 30, 50..."
                        autoComplete="off"
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
                        aria-invalid={fieldState.invalid}
                        placeholder="pages, reps, minutes..."
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </>
            )}

            <Controller
              name="color"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Color</FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      {...field}
                      className="h-10 w-20 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description (Optional)</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      placeholder="I'm doing this because..."
                      rows={4}
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
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="mobile-habit-form">
            Create Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
