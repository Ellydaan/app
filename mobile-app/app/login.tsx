import React from 'react';
import { View, TextInput, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { Header, SubHeader, Label, ButtonText } from '@/components/typography';
import tw from 'twrnc';
import {UserLoginState} from "@/constants/types/user";
import api from "@/utils/api";
import {useSession} from "@/utils/ctx";
import {router} from "expo-router";
import {setStorageItemAsync} from "@/hooks/useStorageState";

const LoginScreen: React.FC = () => {
    const { signIn } = useSession();
    const [user, setUser] = React.useState<UserLoginState>({
        email: '',
        password: ''
    });

    const handleLogin = async () => {
        try {
            const response = await api.post('/api/login', user);
            await setStorageItemAsync('token', response.data?.jwt);
            signIn();
            router.replace('/')
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ImageBackground
            source={require('@/assets/images/auth/batman-auth.jpg')}
            style={tw`flex-1`}
            blurRadius={16}
            resizeMode="cover"
        >
            <View style={tw`absolute inset-0 bg-black/60`} />

            <SafeAreaView style={tw`flex-1 flex-col items-center justify-center gap-4 p-4`}>
                <View style={tw`flex flex-col mb-20 gap-4 p-4`}>
                    <Header className={`text-center`}>
                        SE CONNECTER
                    </Header>
                    <SubHeader className={`text-center px-10`}>
                        Gardez une trace de votre temps, même dans les nuits les plus sombres de Gotham
                    </SubHeader>
                </View>

                <View style={tw`flex flex-col gap-6 w-[80%]`}>
                    <View>
                        <Label>
                            Email
                        </Label>
                        <TextInput
                            style={[tw`w-full bg-white p-4 rounded-md`, {fontFamily: 'Poppins_400Regular'}]}
                            placeholder={"Entrez votre email"}
                            autoCapitalize='none'
                            placeholderTextColor="#9CA3AF"
                            value={user.email}
                            onChangeText={text => setUser({...user, email: text})}
                        />
                    </View>

                    <View>
                        <Label>
                            Mot de passe
                        </Label>
                        <TextInput
                            style={[tw`w-full bg-white p-4 rounded-md`, {fontFamily: 'Poppins_400Regular'}]}
                            placeholder="Entrez votre mot de passe"
                            secureTextEntry
                            placeholderTextColor="#9CA3AF"
                            value={user.password}
                            onChangeText={text => setUser({...user, password: text})}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    style={tw`bg-[#c0f175] p-4 rounded-lg mt-6 w-[80%]`}
                >
                    <ButtonText>Se connecter</ButtonText>
                </TouchableOpacity>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default LoginScreen;