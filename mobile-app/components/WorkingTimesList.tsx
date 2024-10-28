import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from "react-native";
import {BodyText, Header} from "@/components/typography";
import api from "@/utils/api";
import dateToElixirNaiveDate, {constructUrl} from "@/utils/date-service";
import {useStorageState} from "@/hooks/useStorageState";
import tw from "twrnc";
import {is} from "@babel/types";

interface LastWorkingTimesProps {
    lastClocking?: {
        id: number | null,
        status: boolean,
        time: string | null,
        user_id: number | null
    };
    userID: string | undefined;
    isLoading: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
}


export default function WorkingTimesList({
                                             lastClocking,
                                             userID,
                                             isLoading,
                                             startDate = null,
                                             endDate = null
                                         }: LastWorkingTimesProps) {
    const [token] = useStorageState('token');
    const [lastWorkingTimes, setLastWorkingTimes] = useState([]);

    const fetchLastWorkingTimes = async () => {
        try {
            const response = await api.get(constructUrl(userID, startDate, endDate), {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            });
            setLastWorkingTimes(response.data.data);
        } catch (error) {
            console.log('WorkingTimes error :', error);
        }
    }

    const renderWorkingTime = ({item}: any) => {
        const start = new Date(item.start);
        const end = new Date(item.end);
        return (
            <View style={tw`w-[100%] bg-[#212936] p-4 mb-2 rounded-2`}>
                <BodyText
                    className={"text-xl"}>De: {start.toLocaleDateString('fr') + ' ' + start.toTimeString()}</BodyText>
                <BodyText className={"text-xl"}>À: {end.toLocaleDateString('fr') + ' ' + end.toTimeString()}</BodyText>
            </View>
        )
    }

    useEffect(() => {
        if (!token[0] && userID) {
            fetchLastWorkingTimes();
        }
    }, [token, lastClocking, userID, startDate, endDate]);

    return (
        <View>
            {isLoading ?
                <View style={tw`p-[34px]`}>
                    <ActivityIndicator color={'#c0f175'} size={"large"}/>
                </View>
                :
                lastWorkingTimes.length === 0 ?
                    <BodyText className={'text-center mt-4'}>Aucun horaire de travail</BodyText>
                    :
                    <FlatList
                        style={tw`mt-4 p-4`}
                        data={lastWorkingTimes}
                        renderItem={renderWorkingTime}
                    />
            }
        </View>
    );
}