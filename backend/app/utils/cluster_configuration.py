"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ClusterConfigurationProps {
  clusterCount: number
  onClusterCountChange: (count: number) => void
  isLoading: boolean
}

export default function ClusterConfiguration({
  clusterCount,
  onClusterCountChange,
  isLoading,
}: ClusterConfigurationProps) {
  const [algorithm] = useState("kmeans") // For future use if more algorithms are added

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="algorithm">Clustering Algorithm</Label>
          <Select disabled value={algorithm}>
            <SelectTrigger id="algorithm" className="mt-1.5">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kmeans">K-means</SelectItem>
              {/* Other algorithms can be added here in the future */}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cluster-count">Number of Clusters (K)</Label>
          <div className="flex items-center space-x-4">
            <Slider
              id="cluster-count"
              min={2}
              max={100}
              step={1}
              value={[clusterCount]}
              onValueChange={(value) => onClusterCountChange(value[0])}
              className="flex-1"
            />
            <Input
              type="number"
              min={2}
              max={100}
              value={clusterCount}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value)
                if (!isNaN(value) && value >= 2 && value <= 100) {
                  onClusterCountChange(value)
                }
              }}
              className="w-20"
            />
          </div>
          <p className="text-xs text-muted-foreground">Select the number of clusters to generate (2-100).</p>
        </div>
      </div>

      <div className="rounded-lg bg-muted p-4">
        <h3 className="text-sm font-medium mb-2">What happens next?</h3>
        <p className="text-sm text-muted-foreground">
          When you click "Next", your data will be sent for processing. The system will:
        </p>
        <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
          <li>Generate representative topics for each cluster</li>
          <li>Create visualizations to help you understand the results</li>
          <li>Prepare a downloadable file with the analysis</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2">
          This process may take a few moments depending on the size of your data.
        </p>
      </div>
    </div>
  )
}
