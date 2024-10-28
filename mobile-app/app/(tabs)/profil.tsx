import {Alert, Button, Modal, SafeAreaView, TextInput, TouchableOpacity, View} from "react-native";
import {BodyText, ButtonText, Header, SubHeader} from "@/components/typography";
import {useEffect, useState} from "react";
import {useSession} from "@/utils/ctx";
import {router} from "expo-router";
import tw from "twrnc";
import {useStorageState} from "@/hooks/useStorageState";
import {User} from "@/constants/types/user";
import api from "@/utils/api";
import {jwtDecode} from "jwt-decode";

export default function Profil() {
    const {signOut} = useSession();
    const [token, setToken] = useStorageState('token');
    const [isLoading, setIsLoading] = useState(true);
    const [userID, setUserID] = useState<string | undefined>(undefined);
    const [user, setUser] = useState<User | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const setEmail = (text: string) => {
        // @ts-ignore
        setUser({...user, email: text});
    }
    const setUserName = (text: string) => {
        // @ts-ignore
        setUser({...user, username: text});
    }

    const fetchUser = async () => {
        try {
            const response = await api.get(`/api/users/${userID}`, {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            });
            setUser(response.data.data);
        } catch (error) {
            console.log('Erreur lors de la récupération des données:', error);
        }
    }

    const handleDeleteAccount = () => {
        Alert.alert(
            "Supprimer le compte",
            "Êtes-vous sûr de vouloir supprimer votre compte ?",
            [
                {text: "Annuler", style: "cancel"},
                {text: "Supprimer", onPress: () => deleteAccount()}
            ]
        );
    };
    const deleteAccount = async () => {
        try {
            await api.delete(`/api/users/${userID}`, {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            });
            signOut();
            router.replace("/login");
        } catch (error) {
            console.log('Erreur lors de la suppression du compte:', error);
        }
    }

    const handleLogout = () => {
        signOut();
        router.replace("/login");
    };

    const handleSaveChanges = async () => {
        try {
            await api.patch(`/api/users/${userID}`, {user: user}, {
                headers: {
                    Authorization: `Bearer ${token[1]}`
                }
            });
            setModalVisible(false);
        } catch (error) {
            console.log('Erreur lors de la mise à jour des données:', error);
        }
    };

    useEffect(() => {
        if (!token[0]) {
            const decodedToken = jwtDecode(token[1]);
            setUserID(decodedToken?.sub);
        }
    }, [token]);

    useEffect(() => {
        if (userID) {
            fetchUser();
        }
    }, [userID]);

    return (
        <SafeAreaView style={tw`flex-1 p-5  bg-[#121826]`}>
            <Header className={'text-start pt-4 ml-2 mb-3'} >Profil</Header>

            <View style={tw`flex-col justify-center items-center mt-6 p-6 gap-6`}>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={tw`bg-[#c0f175] p-4 rounded-lg w-[100%]`}
                >
                    <ButtonText className={'text-lg'}>Modifier mes informations</ButtonText>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleDeleteAccount}
                    style={tw`bg-[#FF6384] p-4 rounded-lg w-[100%]`}
                >
                    <ButtonText className={'text-lg'}>Supprimer mon compte</ButtonText>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                    <View style={tw`bg-[#121826] rounded-lg p-5 w-[98%]`}>
                        <Header level={3} color={'#fff'}>Modifier mes informations</Header>
                        <View style={tw`flex flex-col gap-2 mt-4`}>
                            <TextInput
                                style={[tw`bg-[#212936] text-white p-3 rounded-md`, {fontFamily: 'Poppins_400Regular'}]}
                                placeholder="Nom"
                                value={user?.username}
                                onChangeText={setUserName}
                            />
                            <TextInput
                                style={[tw`bg-[#212936] text-white p-3 rounded-md`, {fontFamily: 'Poppins_400Regular'}]}
                                placeholder="Email"
                                value={user?.email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>

                        <TouchableOpacity onPress={handleSaveChanges}>
                            <ButtonText color={'#c0f175'} className={'text-lg mt-4'}>Modifier</ButtonText>
                        </TouchableOpacity>
                        <Button title="Annuler" onPress={() => setModalVisible(false)} color="gray"/>
                    </View>
                </View>
            </Modal>
            {/* Bouton de deconnexion */}
            <TouchableOpacity
                onPress={handleLogout}
                style={tw`absolute mt-5 bottom-1 left-36`}
            >
                <BodyText color={"#c0f175"} className={`text-lg underline`}>Se déconnecter</BodyText>
            </TouchableOpacity>
        </SafeAreaView>
    );
}