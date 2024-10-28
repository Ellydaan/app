import {Member, Team, WorkedHoursStatsData} from '@/constants/types/teams'
import {
    ActivityIndicator,
    Button,
    Modal,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import tw from "twrnc";
import {ButtonText, Header, SubHeader} from "@/components/typography";
import {router, useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import api from "@/utils/api";
import {useStorageState} from "@/hooks/useStorageState";
import {TeamMember} from "@/components/teams/TeamsList";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import WorkedHoursStats from "@/components/teams/WorkedHoursStats";
import dateToElixirNaiveDate from "@/utils/date-service";
import {Ionicons} from "@expo/vector-icons";
import {Picker} from '@react-native-picker/picker';


export default function TeamPage() {
    const [token] = useStorageState('token');
    const {id} = useLocalSearchParams();
    const [team, setTeam] = useState<Team | undefined>(undefined);
    const [startDate, setStartDate] = useState<any>(new Date());
    const [endDate, setEndDate] = useState<any>(new Date());
    const [data, setData] = useState<WorkedHoursStatsData | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [users, setUsers] = useState<Member[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/users', {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            });
            setUsers(response.data.data);
        } catch (error) {
            console.log('Erreur users :', error);
        }
    }

    const fetchTeam = async () => {
        try {
            const response = await api.get(`/api/teams/${id}`, {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            });
            setTeam(response.data.data);
        } catch (error) {
            console.log('Erreur team:', error);
        }
    }

    const fetchTabData = async () => {
        try {
            const response = await api.get(`/api/teams/${id}/working_hours?start=${dateToElixirNaiveDate(startDate, false)}&end=${dateToElixirNaiveDate(endDate, false)}`, {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            });
            setData(response.data);
        } catch (error) {
            console.log('Erreur lors de la récupération des données:', error);
        }
    }

    const removeMember = async (member: Member) => {
        try {
            const response = await api.post(`/api/teams/${id}/remove_member/${member.id}`, null, {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            })
            setTeam({...team, members: response.data.data.members} as Team);
        } catch (error) {
            console.log('Erreur lors de la suppression du membre:', error);
        }
    }

    const addMember = async (memberID: string) => {
        if (!memberID) return;
        try {
            const response = await api.post(`/api/teams/${id}/add_member/${memberID}`, null, {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            });
            setTeam({...team, members: response.data.data.members} as Team);
            setAddMemberModalVisible(false);
        } catch (error) {
            console.log('Erreur lors de l\'ajout du membre:', error);
        }
    }

    const handleUpdateTeam = async () => {

        try {
            const response = await api.patch(`/api/teams/${id}`, {
                team: {
                    name: team?.name
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            });

            console.log('Données mises à jour:', response.data);

            setEditModalVisible(false);
        } catch (error) {
            console.log('Erreur lors de la mise à jour des données:', error);
        }
    }

    useEffect(() => {
        if (!token[0]) {
            fetchTeam().finally(fetchUsers)
        }
    }, [token]);
    useEffect(() => {
        if (team) {
            fetchTabData();
        }
    }, [team, startDate, endDate]);

    return (
        <SafeAreaView style={tw`flex-1 bg-[#121826]`}>
            <ScrollView>
                <View style={tw`flex flex-col p-4`}>
                    <TouchableOpacity onPress={() => router.navigate('/teams')}>
                        <Ionicons name={"arrow-back"} size={24} color={"#c0f175"}/>
                    </TouchableOpacity>
                    <View style={tw`flex flex-row justify-between items-center`}>
                        <Header className={'pt-4 mb-3'}>
                            {team?.name}
                        </Header>
                        <TouchableOpacity onPress={() => setEditModalVisible(true)}>
                            <Ionicons name={"pencil"} size={24} color={"#c0f175"}/>
                        </TouchableOpacity>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={editModalVisible}
                            onRequestClose={() => setEditModalVisible(!editModalVisible)}
                        >
                            <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                                <View style={tw`bg-[#121826] rounded-lg p-5 w-[98%]`}>
                                    <Header level={3} color={'#fff'}>Modifier les informations</Header>
                                    <View style={tw`flex flex-col gap-2 mt-4`}>
                                        <TextInput
                                            style={[tw`bg-[#212936] text-white p-3 rounded-md`, {fontFamily: 'Poppins_400Regular'}]}
                                            placeholder="Nom"
                                            value={team?.name}
                                            onChangeText={(text) => setTeam({...team, name: text} as Team)}
                                        />
                                    </View>

                                    <TouchableOpacity onPress={handleUpdateTeam}>
                                        <ButtonText color={'#c0f175'} className={'text-lg mt-4'}>Modifier</ButtonText>
                                    </TouchableOpacity>
                                    <Button title="Annuler" onPress={() => setEditModalVisible(false)} color="gray"/>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    <Header level={3} color={'#FFF'} className={'mb-3'}>
                        Membres
                    </Header>
                    {team?.members && team?.members.length > 0 && (
                        team?.members.map((member: Member) => (
                            <TeamMember
                                key={member.id}
                                member={member}
                                isEditable={true}
                                removeMember={() => removeMember(member)}
                            />
                        ))
                    )}
                    <TouchableOpacity
                        style={tw`w-[100%] h-20 bg-[#2C3444] rounded-lg mb-2 flex flex-row justify-center items-center`}
                        onPress={() => setAddMemberModalVisible(true)}
                    >
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={addMemberModalVisible}
                            onRequestClose={() => setAddMemberModalVisible(!addMemberModalVisible)}
                        >
                            <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                                <View style={tw`bg-[#121826] rounded-lg p-5 w-[98%]`}>
                                    <Header level={3} color={'#fff'}>Ajouter un membre</Header>
                                    <View style={tw`flex flex-col gap-2 mt-4`}>
                                        <Picker
                                            selectedValue={selectedValue}
                                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                                            style={tw`bg-[#212936]`}
                                            mode={'dialog'}
                                        >
                                            <Picker.Item color={"white"} label="Sélectionner un membre" value=""/>
                                            {users.length > 0 && users.map((user: Member) => (
                                                <Picker.Item color={"white"} label={user.username} value={user.id}/>
                                            ))}
                                        </Picker>
                                    </View>
                                    <TouchableOpacity onPress={() => addMember(selectedValue)}>
                                        <ButtonText color={'#c0f175'} className={'text-lg mt-4'}>Ajouter</ButtonText>
                                    </TouchableOpacity>
                                    <Button title="Annuler" onPress={() => setAddMemberModalVisible(false)}
                                            color="gray"/>
                                </View>
                            </View>
                        </Modal>
                        <Ionicons name={"add"} size={30} color={"#c0f175"}/>
                    </TouchableOpacity>
                </View>

                <View style={tw`flex flex-col p-4`}>
                    <Header level={3} color={'#FFF'} className={'mb-3'}>
                        Temps de travails moyens des membres :
                    </Header>
                    <View style={tw`flex flex-row items-center justify-between p-2`}>
                        <SubHeader className={'text-lg pt-4 mb-3'} color={'#fff'}>
                            Début
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
                            Fin
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
                </View>

                <View style={tw`flex items-center`}>
                    {data ?
                        <WorkedHoursStats data={data}/>
                        :
                        <ActivityIndicator size="large" color="#c0f175"/>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );

}