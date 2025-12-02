"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, BarChart3, BookOpen, Settings, LogOut, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true)

    const navItems = [
        { label: "Dashboard", icon: BarChart3, href: "/" },
        { label: "Analytics", icon: BookOpen, href: "#" },
        { label: "Settings", icon: Settings, href: "#" },
    ]

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out z-40 ${isOpen ? "w-64" : "w-20"
                    }`}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-between px-4 py-6 border-b border-border">
                    {isOpen && (
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-accent to-accent/60">
                                <span className="text-sm font-bold text-accent-foreground">T</span>
                            </div>
                            <h1 className="text-lg font-semibold text-foreground">TestBlog</h1>
                        </div>
                    )}
                    {!isOpen && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-accent to-accent/60">
                            <span className="text-sm font-bold text-accent-foreground">T</span>
                        </div>
                    )}
                </div>

                <nav className="flex flex-col gap-2 px-3 py-4">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                {isOpen && <span>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-border px-3 py-4">
                    <div className="flex flex-col gap-2">
                        <Button variant="ghost" size={isOpen ? "sm" : "icon"} className="w-full justify-start">
                            <Bell className="h-5 w-5" />
                            {isOpen && <span className="ml-2">Notifications</span>}
                        </Button>
                        <Button variant="ghost" size={isOpen ? "sm" : "icon"} className="w-full justify-start">
                            <LogOut className="h-5 w-5" />
                            {isOpen && <span className="ml-2">Logout</span>}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed left-4 top-4 z-50 p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors md:hidden"
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Overlay for Mobile */}
            {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}

            {/* Main Content Offset */}
            <div className={`transition-all duration-300 ${isOpen ? "md:ml-64" : "md:ml-20"}`}>
                {/* This wrapper is applied to the main content */}
            </div>
        </>
    )
}
