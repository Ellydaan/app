interface Member {
    id: number;
    username: string;
    email: string;
}

interface Team {
    id: number;
    manager_id: number;
    members: Member[];
    name: string;
}

interface TeamListProps {
    teams: Team[];
}

interface TeamCardProps {
    team: Team;
}

interface TeamMemberProps {
    member: Member;
}

export type {
    Member,
    Team,
    TeamListProps,
    TeamCardProps,
    TeamMemberProps
};