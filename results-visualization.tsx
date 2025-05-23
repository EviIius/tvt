"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TopicsTable from "./topics-table"
import TopicDistribution from "./topic-distribution"
import ClusterVisualization from "./cluster-visualization"
import type { ProcessClusterResponse } from "@/types/api"

interface ResultsVisualizationProps {
  results: ProcessClusterResponse
}

// Function to generate distinct colors based on the number of clusters
function generateColors(count: number): string[] {
  const baseColors = [
    "#7e22ce", // Purple
    "#be185d", // Pink
    "#2563eb", // Blue
    "#16a34a", // Green
    "#ca8a04", // Yellow
    "#dc2626", // Red
    "#0891b2", // Cyan
    "#4f46e5", // Indigo
    "#c026d3", // Fuchsia
    "#db2777", // Rose
    "#65a30d", // Lime
    "#d97706", // Amber
  ]

  if (count <= baseColors.length) {
    return baseColors.slice(0, count)
  }

  const colors: string[] = [...baseColors]
  const additionalCount = count - baseColors.length
  for (let i = 0; i < additionalCount; i++) {
    const hue = (i * 137.508) % 360
    const saturation = 65 + (i % 20)
    const lightness = 45 + (i % 15)
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
  }

  return colors
}

export default function ResultsVisualization({ results }: ResultsVisualizationProps) {
  const [activeTab, setActiveTab] = useState("topics")
  const colors = useMemo(() => generateColors(results?.data?.topics?.length || 0), [results?.data?.topics?.length])

  if (!results.success || !results.data || !results.data.topics || !results.data.clusterData) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {results.error || "No visualization data available"}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="distribution">Topic Distribution</TabsTrigger>
          <TabsTrigger value="clusters">Cluster Visualization</TabsTrigger>
        </TabsList>

        <TabsContent value="topics" className="mt-4">
          <TopicsTable topics={results.data.topics} colors={colors} />
        </TabsContent>

        <TabsContent value="distribution" className="mt-4">
          <TopicDistribution topics={results.data.topics} colors={colors} />
        </TabsContent>

        <TabsContent value="clusters" className="mt-4">
          <ClusterVisualization 
            clusterData={results.data.clusterData} 
            topics={results.data.topics} 
            colors={colors} 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
