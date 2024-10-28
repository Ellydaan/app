
import {router, Slot, Tabs} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {useSession} from "@/utils/ctx";
import {Text} from "react-native";
import tw from "twrnc";
import {Ionicons} from "@expo/vector-icons";
import {useStorageState} from "@/hooks/useStorageState";
import {jwtDecode} from "jwt-decode";

export default function TeamsLayout() {
    const {isLoading} = useSession();
    const [token] = useStorageState('token');

    if (isLoading || token[0]) {
        return <Text>Loading...</Text>;
    }

    return (
        <Slot />
    );
}
