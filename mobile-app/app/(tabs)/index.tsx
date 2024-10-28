import {ActivityIndicator, SafeAreaView, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from "react";
import {useStorageState} from "@/hooks/useStorageState";
import tw from "twrnc";
import {ButtonText, Header, SubHeader} from "@/components/typography";
import api from "@/utils/api";
import dateToElixirNaiveDate from "@/utils/date-service";
import {jwtDecode} from "jwt-decode";
import ClockModule from "@/components/home/ClockModule";
import WorkingTimes from "@/components/WorkingTimesList";

export default function HomeScreen() {
    const [token, setToken] = useStorageState('token');
    const [userID, setUserID] = useState<string | undefined>(undefined);
    const [workingTime, setWorkingTime] = useState<string | null>(null);
    const [lastClocking, setLastClocking] = useState({
        id: null,
        status: false,
        time: null,
        user_id: null
    });
    const [isLoading, setIsLoading] = useState(true);
    const [newClock, setNewClock] = useState(null);

    const isClocking = lastClocking.status;

    const updateTimer = useCallback(() => {
        let interval: any;
        if (isClocking) {
            interval = setInterval(() => {
                const now = new Date();
                // @ts-ignore
                const diff = now - new Date(lastClocking.time);
                const time = new Date(diff).toISOString().substr(11, 8);
                setWorkingTime(time);
            }, 1000);
        } else {
            setWorkingTime(null);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isClocking, lastClocking]);

    const fetchLastClocking = async () => {
        try {
            const response = await api.get(`/api/clocks/${userID}/last`, {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            });
            setLastClocking(response.data.data);
        } catch (error) {
            console.log('Erreur lors de la récupération des données:', error);
        }
    };

    const handleClocking = async () => {
        const newStatus = !isClocking;
        try {
            if (userID) {
                const clockResponse = await api.post(`/api/clocks/${userID}`, {
                        clocks: {
                            status: newStatus,
                            time: dateToElixirNaiveDate(new Date(), true)
                        }
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token[1]}`
                        }
                    }
                );

                const newClockData = clockResponse.data.data;
                setNewClock(newClockData);

                if (newClockData.status === false) {
                    await api.post(`/api/working_times/${userID}`, {
                            working_times: {
                                start: lastClocking.time,
                                end: newClockData.time
                            }
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token[1]}`
                            }
                        });
                }

                await fetchLastClocking();
            }  else {
                console.log('Impossible de pointer, veuillez vous connecter');
            }

        } catch (error) {
            console.error('Erreur lors du pointage:', error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 4000);
        if (!token[0]) {
            const decodedToken = jwtDecode(token[1]);
            setUserID(decodedToken.sub);
            if (userID) {
                fetchLastClocking();
            }
        }

        return () => clearTimeout(timer);
    }, [token]);

    useEffect(() => {
        return updateTimer();
    }, [updateTimer, lastClocking, userID]);

    const end = new Date();
    const start = new Date(end.getTime() - 5 * 24 * 60 * 60 * 1000);
    return (
        <SafeAreaView style={tw`flex-1 bg-[#121826]`}>
            <Header className={'text-start pt-4 ml-2 mb-3'}>
                Gérez votre temps
            </Header>
            <ClockModule
                isClocking={isClocking}
                handleClocking={handleClocking}
                isLoading={isLoading}
                workingTime={workingTime}
            />
            <Header color={'#fff'} level={2} className={'mt-10 mx-2'}>
                Vos derniers horaires de travail
            </Header>
            <WorkingTimes
                isLoading={isLoading}
                lastClocking={lastClocking}
                userID={userID}
                startDate={start}
                endDate={end}
            />
        </SafeAreaView>
    );
}