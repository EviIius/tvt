"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClusterScatterPlot } from "./cluster-scatter-plot"
import type { ProcessClusterResponse } from "@/types/api"

type Topic = NonNullable<ProcessClusterResponse['data']>['topics'][number]
type ClusterPoint = NonNullable<ProcessClusterResponse['data']>['clusterData'][number]

interface ClusterVisualizationProps {
  clusterData: ClusterPoint[]
  topics: Topic[]
  colors: string[]
}

export default function ClusterVisualization({ clusterData, topics, colors }: ClusterVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cluster Visualization</CardTitle>
        <CardDescription>2D visualization of document clusters</CardDescription>
      </CardHeader>
      <CardContent className="h-[500px]">
        <ClusterScatterPlot data={clusterData} topics={topics} colors={colors} />
      </CardContent>
    </Card>
  )
}
