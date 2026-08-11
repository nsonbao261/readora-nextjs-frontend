"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Calendar-backed date input for the Date of Birth field. Stores an ISO
// yyyy-MM-dd string; days outside the allowed age window (minDate..maxDate)
// are disabled so an invalid age can't be picked.
export function DatePickerField({
  id,
  value,
  onChange,
  minDate,
  maxDate,
}: {
  id?: string;
  value: string;
  onChange: (isoDate: string) => void;
  minDate: Date;
  maxDate: Date;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(`${value}T00:00:00`) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        render={
          <Button
            variant="outline"
            className="w-full justify-start font-normal"
          />
        }
      >
        <CalendarIcon data-icon="inline-start" />
        {selected ? format(selected, "dd/MM/yyyy") : "Pick your date of birth"}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "");
            setOpen(false);
          }}
          disabled={{ after: maxDate, before: minDate }}
          startMonth={minDate}
          endMonth={maxDate}
          captionLayout="dropdown"
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
