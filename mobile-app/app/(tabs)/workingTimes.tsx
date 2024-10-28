import {SafeAreaView, View} from "react-native";
import {Header, SubHeader} from "@/components/typography";
import tw from "twrnc";
import {useStorageState} from "@/hooks/useStorageState";
import {useEffect, useState} from "react";
import WorkingTimesList from "@/components/WorkingTimesList";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {jwtDecode} from "jwt-decode";

export default function WorkingTimes() {
    const [token, setToken] = useStorageState('token');
    const [userID, setUserID] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<any>(new Date());
    const [endDate, setEndDate] = useState<any>(new Date());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        if (!token[0]) {
            const decodedToken = jwtDecode(token[1]);
            setUserID(decodedToken.sub);
        }
        return () => clearTimeout(timer);
    }, [token]);

    const datePicker = (date: Date) => {
        setStartDate(date);
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-[#121826]`}>
            <Header className={'pt-4 ml-2 mb-3'}>Vos temps de travail</Header>
            <View style={tw`flex flex-row items-center justify-between p-2`}>
                <SubHeader className={'text-lg pt-4 mb-3'} color={'#fff'}>
                    Choisissez une date de début
                </SubHeader>
                <RNDateTimePicker
                    themeVariant={"dark"}
                    value={startDate}
                    maximumDate={new Date()}
                    mode={'date'}
                    onChange={(event, date) => setStartDate(date)}
                />
            </View>
            <View style={tw`flex flex-row items-center justify-between p-2`}>
                <SubHeader className={'pt-4 text-lg mb-3'} color={'#fff'}>
                    Choisissez une date de fin
                </SubHeader>
                <RNDateTimePicker
                    themeVariant={"dark"}
                    value={endDate}
                    maximumDate={new Date()}
                    minimumDate={startDate}
                    mode={'date'}
                    onChange={(event, date) => setEndDate(date)}
                />
            </View>
            <WorkingTimesList
                userID={userID}
                isLoading={false}
                startDate={startDate}
                endDate={endDate}
            />
        </SafeAreaView>
    );
};