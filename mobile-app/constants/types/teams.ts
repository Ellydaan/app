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
    isEditable?: boolean;
    removeMember?: () => void;
}

interface WorkedHoursStatsData {
    daily_average: string;
    weekly_average: string;
}

export type {
    Member,
    Team,
    TeamListProps,
    TeamCardProps,
    TeamMemberProps,
    WorkedHoursStatsData
};