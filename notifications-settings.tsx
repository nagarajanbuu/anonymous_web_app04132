import { Bell, Mail, MessageSquare, Phone, Shield } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function NotificationsSettings() {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          <Switch id="notifications-toggle" />
        </div>
        <div className="space-y-4">
          <NotificationItem
            icon={<Bell className="h-5 w-5 text-gray-500" />}
            title="Push notifications"
            description="Receive push notifications"
          />
          <NotificationItem
            icon={<Mail className="h-5 w-5 text-gray-500" />}
            title="Email notifications"
            description="Receive email notifications"
          />
          <NotificationItem
            icon={<MessageSquare className="h-5 w-5 text-gray-500" />}
            title="Text notifications"
            description="Receive text notifications"
          />
          <NotificationItem
            icon={<Phone className="h-5 w-5 text-gray-500" />}
            title="Phone notifications"
            description="Receive phone notifications"
          />
          <NotificationItem
            icon={<Shield className="h-5 w-5 text-gray-500" />}
            title="Security notifications"
            description="Receive security notifications"
          />
        </div>
      </div>
    </div>
  )
}

function NotificationItem({ icon, title, description }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <Switch id={`${title.toLowerCase().replace(/\s+/g, "-")}-toggle`} />
    </div>
  )
}

