import {FlatList, TouchableOpacity, View} from "react-native";
import {BodyText, Header, SubHeader} from "@/components/typography";
import tw from "twrnc";
import {Member, TeamCardProps, TeamListProps, TeamMemberProps} from "@/constants/types/teams";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export const TeamMember = ({member, isEditable = false, removeMember}: TeamMemberProps) => (
    <View style={tw`bg-[#2C3444] p-3 rounded-lg mb-2 flex flex-row justify-between items-center`}>
        <View>
            <Header color={'#fff'} level={3}>{member.username}</Header>
            <BodyText className={'mt-1'}>Email : {member.email}</BodyText>
        </View>
        <View>
            {isEditable && (
                <TouchableOpacity onPress={removeMember}>
                    <Ionicons name={'trash'} size={24} color={'red'}/>
                </TouchableOpacity>
            )}
        </View>
    </View>
);

export const TeamCard = ({team}: TeamCardProps) => (
    <TouchableOpacity style={tw`bg-[#212936] rounded-xl p-4 shadow-lg`}
                      onPress={() => router.navigate(`/teams/${team.id}`)}>
        <View style={tw`flex-row justify-between items-center mb-4 border-b border-[#2C3444] pb-3`}>
            <Header level={2}>{team.name}</Header>
        </View>

        <View>
            <SubHeader className={'mb-3'}>
                Membres ({team.members.length})
            </SubHeader>
            {team.members.length > 0 ? (
                team.members.map((member: Member) => (
                    <TeamMember key={member.id} member={member}/>
                ))
            ) : (
                <View style={tw`bg-[#2C3444] p-4 rounded-lg`}>
                    <BodyText className={'text-center'}>Aucun membre</BodyText>
                </View>
            )}
        </View>
    </TouchableOpacity>
);

export default function TeamsList({teams}: TeamListProps) {
    return (
        <FlatList
            data={teams}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <TeamCard team={item}/>}
            contentContainerStyle={tw`p-4 bg-[#121826]`}
            ItemSeparatorComponent={() => <View style={tw`h-4`}/>}
            showsVerticalScrollIndicator={false}
        />
    );
}