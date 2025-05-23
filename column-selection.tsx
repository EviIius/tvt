"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ColumnSelectionProps {
  columns: string[]
  selectedColumns: string[]
  onSelectionChange: (selected: string[]) => void
}

export default function ColumnSelection({ columns, selectedColumns, onSelectionChange }: ColumnSelectionProps) {
  const handleColumnToggle = (column: string) => {
    if (selectedColumns.includes(column)) {
      onSelectionChange(selectedColumns.filter((c) => c !== column))
    } else {
      onSelectionChange([...selectedColumns, column])
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Select the columns you want to analyze. You can select multiple columns.
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {columns.map((column) => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                id={`column-${column}`}
                checked={selectedColumns.includes(column)}
                onCheckedChange={() => handleColumnToggle(column)}
              />
              <Label
                htmlFor={`column-${column}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {column}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="text-sm">
        <span className="font-medium">Selected columns:</span>{" "}
        {selectedColumns.length === 0 ? (
          <span className="text-muted-foreground">None selected</span>
        ) : (
          selectedColumns.join(", ")
        )}
      </div>
    </div>
  )
}
