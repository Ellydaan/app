import {router, Tabs} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {useSession} from "@/utils/ctx";
import {Text} from "react-native";
import tw from "twrnc";
import {Ionicons} from "@expo/vector-icons";
import {useStorageState} from "@/hooks/useStorageState";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
    user_role: string;
}

export default function TabLayout() {
    const {session, isLoading} = useSession();
    const [token, setToken] = useStorageState('token');
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (token[1]) {
            const decodedToken = jwtDecode<DecodedToken>(token[1]);
            setUserRole(decodedToken.user_role);
        }
    }, [token]);

    if (isLoading || token[0]) {
        return <Text>Loading...</Text>;
    }

    if (session !== 'connected') {
        return router.navigate("/login")
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: tw`bg-[#212936] text-white pb-5`,
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarLabelStyle: tw`text-xs font-medium mb-1`,
        }}
        >
            <Tabs.Screen
                name={"index"}
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused, size }) => {
                        return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={focused ? '#FFFFFF' : '#9CA3AF'} />;
                    },
                }}
            />
            <Tabs.Screen
                name={"workingTimes"}
                options={{
                    title: "Working Times",
                    tabBarIcon: ({ focused, size }) => {
                        return <Ionicons name={focused ? 'calendar-clear' : 'calendar-clear-outline'} size={size} color={focused ? '#FFFFFF' : '#9CA3AF'} />;
                    },
                }}
            />
            {userRole === 'manager' ? (
                <Tabs.Screen
                    name={"teams"}
                    options={{
                        title: "Mes équipes",
                        tabBarIcon: ({ focused, size }) => {
                            return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={focused ? '#FFFFFF' : '#9CA3AF'} />;
                        },
                    }}
                />
            )
                : <Tabs.Screen name={"teams"} options={{href: null}} />
            }
            <Tabs.Screen
                name={"profil"}
                options={{
                    title: "Profil",
                    tabBarIcon: ({ focused, size }) => {
                        return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={focused ? '#FFFFFF' : '#9CA3AF'} />;
                    },
                }} />
        </Tabs>
    );
}
