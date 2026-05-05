import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { PocaIcon } from '@/components/kuaci/PocaIcon';
import { Kuaci } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Kuaci.pink,
        tabBarInactiveTintColor: Kuaci.ink3,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Kuaci.paper2,
          borderTopColor: Kuaci.paper3,
          borderTopWidth: 1.5,
          height: Platform.OS === 'ios' ? 82 : 62,
          paddingBottom: Platform.OS === 'ios' ? 20 : 6,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'SpecialElite_400Regular',
          fontSize: 10,
          letterSpacing: 0.06,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'shelf',
          tabBarIcon: ({ color, focused }) => (
            <PocaIcon name="binder" size={24} color={color} filled={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: 'templates',
          tabBarIcon: ({ color, focused }) => (
            <PocaIcon name="template" size={24} color={color} filled={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
