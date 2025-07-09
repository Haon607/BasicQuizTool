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
    fontColor?: string;
    reference: string;
}

export interface Player {
    id: number;
    name: string;
    reference: string; // UUID
    score: number;
    selectedAnswerId?: number;
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
    picturePath: string;
    questions: Question[];
}

export interface Question {
    id: number;
    questionText: string;
    picturePath?: string;
    answers: Answer[];
    time: number;
    showAnswers: boolean;
}

export interface Game {
    id: number;
    players: Player[];
    touchComponents: TouchComponent[];
    hasStarted: boolean;
    questionSet: QuestionSet;
    hasEnded: boolean;
    questionNumber: number;
}
