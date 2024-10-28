import React from 'react';
import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import tw from "twrnc";
import {ButtonText, SubHeader} from "@/components/typography";

interface ClockModuleProps {
    isLoading: boolean;
    workingTime: string|null;
    isClocking: boolean;
    handleClocking: () => void;
}


export default function ClockModule({isLoading, workingTime, isClocking, handleClocking}: ClockModuleProps) {
    return (
        <View>
            {isLoading ?
                <View style={tw`p-[34px]`}>
                    <ActivityIndicator color={'#c0f175'} size={"large"}/>
                </View>
                :
                <SubHeader className={'text-5xl text-center mt-10 p-2'}>
                    {
                        workingTime || "00:00:00"
                    }
                </SubHeader>
            }
            <TouchableOpacity
                style={[isClocking ? tw`bg-[#FF6384]` : tw`bg-[#c0f175]`, tw`p-4 rounded-lg m-4`]}
                onPress={handleClocking}
            >
                <ButtonText>
                    {isClocking ? 'Clock Out' : 'Clock In'}
                </ButtonText>
            </TouchableOpacity>
        </View>
    );
}