"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Topic } from '../types/api'

interface TopicsTableProps {
  topics: Topic[]
  colors: string[]
}

export default function TopicsTable({ topics, colors }: TopicsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Topics</CardTitle>
        <CardDescription>The main topics identified in your data</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {topics.map((topic, index) => (
              <div key={topic.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                  <div>
                    <div className="font-medium">{topic.name}</div>
                    <div className="text-sm text-muted-foreground">Topic {topic.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{topic.count}</Badge>
                  <Badge>{topic.percentage.toFixed(1)}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
