import {SafeAreaView, View} from "react-native";
import tw from "twrnc";
import {BodyText, Header} from "@/components/typography";
import {useStorageState} from "@/hooks/useStorageState";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {router} from "expo-router";
import api from "@/utils/api";
import TeamsList from "@/components/teams/TeamsList";
import {Team} from "@/constants/types/teams";

interface DecodedToken {
    sub: string;
    user_role: string;
}

export default function Teams() {
    const [token] = useStorageState('token');
    const [userID, setUserID] = useState('userID');
    const [teams, setTeams] = useState<Team[]>([]);

    const fetchTeams = async () => {
        try {
            const response = await api.get(`/api/manager/${userID}/teams`, {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            });
            setTeams(response.data.data);
        } catch (error) {
            console.log('Erreur lors de la récupération des données:', error);
        }
    }

    useEffect(() => {
        if (!token[0]) {
            const decodedToken = jwtDecode<DecodedToken>(token[1]);
            if (!(decodedToken.user_role in ['admin', 'manager'])) {
                router.replace('/');
            }
            setUserID(decodedToken.sub);
        }
    }, [token]);

    useEffect(() => {
        if (!token[0] && userID) {
            fetchTeams();
        }
    }, [userID]);

    return (
        <SafeAreaView style={tw`flex-1 p-5 bg-[#121826]`}>
            <Header className={'text-start pt-4 ml-2 mb-3'}>
                Mes équipes
            </Header>
            {
                teams && teams.length > 0 ? (
                    <TeamsList teams={teams} />
                ) : (
                    <View style={tw`bg-[#2C3444] p-4 rounded-lg`}>
                        <BodyText className={'text-center'}>
                            Vous n'avez pas encore d'équipe
                        </BodyText>
                    </View>
                )
            }

        </SafeAreaView>
    );
}