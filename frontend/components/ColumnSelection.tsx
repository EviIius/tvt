"use client"

import { Checkbox } from "../../ui/checkbox"
import { Label } from "../../ui/label"
import { ScrollArea } from "../../ui/scroll-area"
import React from 'react';

interface ColumnSelectionProps {
  columns: any[] // Changed to any[] for diagnostics
  selectedColumns: string[]
  onSelectionChange: (selected: string[]) => void
}

export default function ColumnSelection({ columns, selectedColumns, onSelectionChange }: ColumnSelectionProps) {
  const handleColumnToggle = (columnValue: string) => {
    if (selectedColumns.includes(columnValue)) {
      onSelectionChange(selectedColumns.filter((c) => c !== columnValue))
    } else {
      onSelectionChange([...selectedColumns, columnValue])
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Select the columns you want to analyze. You can select multiple columns.
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-4 bg-white"> {/* Added bg-white for consistency if needed */}
        <div className="space-y-4">
          {columns.map((column, index) => {
            const isString = typeof column === 'string';
            
            // Critical: Log the type and value of each item in the columns array
            console.log(`ColumnSelection Item [${index}]:`, { type: typeof column, value: column });

            const itemKey = isString ? `${column}-${index}` : `column-idx-${index}`;
            const itemId = isString ? `column-${column.replace(/\\s+/g, '-')}-${index}` : `column-idx-${index}`;
            const columnDisplay = isString ? column : JSON.stringify(column);
            // For selection, we can only meaningfully use strings.
            // If it's not a string, it cannot be part of selectedColumns (which is string[])
            // So, the checkbox for non-strings should be disabled.

            return (
              <div key={itemKey} className="flex items-center space-x-2">
                <Checkbox
                  id={itemId}
                  checked={isString && selectedColumns.includes(column)}
                  onCheckedChange={() => {
                    if (isString) {
                      handleColumnToggle(column);
                    } else {
                      // This case should ideally not be reachable if checkbox is disabled
                      console.warn("Attempted to toggle a non-string column representation:", column);
                    }
                  }}
                  disabled={!isString} // Disable checkbox if the column item is not a string
                />
                <Label
                  htmlFor={itemId}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {columnDisplay}
                </Label>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="text-sm mt-4"> {/* Added mt-4 for spacing if needed */}
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
