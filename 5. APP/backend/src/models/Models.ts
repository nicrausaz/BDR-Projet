export class Sport {
    id: number;
    name: string;
}

export class Club {
    id: number;
    name: string;
    Sport: Sport;
}

export class Federation {
    id: number;
    name: string;
    Sport: Sport;
}

export class Administrator {
    uuid: string;
    email: string;
    lastname: string;
    firstname: string;
    password: string;
}

export class Player {
    uuid: string;
    lastname: string;
    firstname: string;
    birthdate: Date;
}

export class League {
    id: number;
    level: string;
    gender: "M" | "F";
}


export class Team {
    id: number;
    name: string;
    club: Club;
    league: League;
}

export class Season {
    id: number;
    name: string;
    startAt: Date;
    endAt: Date;
}

export class Championship {
    id: number;
    name: string;
    startAt: Date;
    endAt: Date;
    season: Season;
    league: League;
}

export class Stadium {
    id: number;
    name: string;
    address: string;
    capacity: number;
}

export class Event {
    uuid: string;
    name: string;
    startAt: Date;
    endAt: Date;
    createdAt: Date;
    updatedAt: Date;
    stadium: Stadium;
}

export class Game extends Event {
    scoreHome: number;
    scoreGuest: number;
    canceled: boolean;
    gameId: string;
    championship: Championship;
    teamHome: Team;
    teamGuest: Team;

}

export class Training extends Event {
    description: string;
    team: Team;
}
