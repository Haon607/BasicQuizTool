export type TouchComponentType = 'button' | 'label' | 'input';

export interface TouchComponent {
    id: string;
    type: TouchComponentType;
    color?: string;
    disabled?: boolean;
    displayName?: string;
    pressed?: boolean;
    sendUpdate?: boolean;
    toolbarButton?: boolean;
    value?: string;
}

export interface Player {
    id: number;
    name: string;
    reference: string; // UUID
    score: number;
}

export interface Answer {
    id: number;
    answerText: string;
    isCorrect: boolean;
}

export interface QuestionSet {
    id: number;
    name: string;
    sound: boolean;
    questions: Question[];
}

export interface Question {
    id: number;
    questionText: string;
    picturePath: string;
    answers: Answer[];
    set: QuestionSet;
}

export interface Game {
    id: number;
    players: Player[];
    touchComponents: TouchComponent[];
    hasStarted: boolean;
}
