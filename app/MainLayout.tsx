"use client"

import type React from "react"

import { MainLayout as Layout } from "@/components/layout/main-layout"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>{children}</Layout>
}
