import { Tabs } from 'expo-router'
import { Home, Search, Calendar, MessageCircle, User } from 'lucide-react-native'
import { useAuthStore } from '@/store/auth'

export default function TabsLayout() {
  const { user } = useAuthStore()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#0EA5A5',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'בית',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'עיון',
          tabBarIcon: ({ color, size }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'הזמנות',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'הודעות',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'פרופיל',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
