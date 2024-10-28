import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import {WorkedHoursStatsData} from "@/constants/types/teams";

interface WorkedHoursStatsProps {
    data: WorkedHoursStatsData;
}

export default function WorkedHoursStats ({data}: WorkedHoursStatsProps ) {
    return (
        <View style={tw`w-[90%] border border-white rounded-lg overflow-hidden`}>
            <View style={tw`flex-row bg-[#212936]`}>
                <View style={tw`flex-1 p-4 border-r border-white`}>
                    <Text style={tw`text-[#c0f175] font-bold text-center`}>Moy. Journalière</Text>
                </View>
                <View style={tw`flex-1 p-4`}>
                    <Text style={tw`text-[#c0f175] font-bold text-center`}>Moy. Hebdomadaire</Text>
                </View>
            </View>

            <View style={tw`flex-row bg-transparent`}>
                <View style={tw`flex-1 p-4 border-r border-white`}>
                    <Text style={tw`text-white text-center`}>{data.daily_average}</Text>
                </View>
                <View style={tw`flex-1 p-4`}>
                    <Text style={tw`text-white text-center`}>{data.weekly_average}</Text>
                </View>
            </View>
        </View>
    );
};