"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Shield } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    enableSelfDestruct: true,
    allowVideoCalls: true,
    enableNotifications: true,
    saveMessageHistory: false,
    enhancedPrivacy: true,
  })

  const updateSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Settings & Privacy</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Self-Destructing Messages</Label>
                  <p className="text-sm text-gray-500">Messages will automatically delete after the set timer</p>
                </div>
                <Switch
                  checked={settings.enableSelfDestruct}
                  onCheckedChange={() => updateSetting("enableSelfDestruct")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Video Calls</Label>
                  <p className="text-sm text-gray-500">Enable or disable anonymous video calls</p>
                </div>
                <Switch checked={settings.allowVideoCalls} onCheckedChange={() => updateSetting("allowVideoCalls")} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enhanced Privacy Mode</Label>
                  <p className="text-sm text-gray-500">Additional encryption and privacy features</p>
                </div>
                <Switch checked={settings.enhancedPrivacy} onCheckedChange={() => updateSetting("enhancedPrivacy")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications & History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications for new messages</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={() => updateSetting("enableNotifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Save Message History</Label>
                  <p className="text-sm text-gray-500">Store message history locally (not recommended)</p>
                </div>
                <Switch
                  checked={settings.saveMessageHistory}
                  onCheckedChange={() => updateSetting("saveMessageHistory")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

