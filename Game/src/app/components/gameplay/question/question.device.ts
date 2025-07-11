import { DeviceService } from "../../../services/device.service";
import { Game, TouchComponent } from "../../../models/DTOs";
import { getAnswerColorFromIndex, primary } from "../../../../styles";
import { possibleStates } from "./question.component";
import { ColorFader } from "../../../utils";

export class QuestionDevice {
    constructor(
        private device: DeviceService,
    ) {
    }

    handleTabletInput(components: TouchComponent[], advanceState: () => void, setPlayerAnswer: (component: TouchComponent) => void) {
        components.filter(component => component.pressed).forEach(component => {
            if (component.id === "continue" && component.reference === 'host') advanceState();
            if (component.id.startsWith("player-answer")) setPlayerAnswer(component);
        });
    }

    sendUiState(nextState: possibleStates, game: Game, currentlyShownToPlayers: { question: boolean; answersSelectable: boolean | null, correctAnswerIds: number[] }, pictureQuestionNumberOfAnswers: number | null = null): void {
        let elements: TouchComponent[] = [
            {
                id: "continue",
                displayName: this.getActionOfNextState(nextState),
                type: "button",
                sendUpdate: true,
                toolbarButton: true,
                color: primary,
                reference: 'host'
            },
            {
                id: "question-host",
                displayName: game.questionSet.questions[game.questionNumber].questionText,
                type: "label",
                color: '#FFF',
                fontColor: '#000',
                reference: 'host'
            }
        ];

        game.questionSet.questions[game.questionNumber].answers.forEach((answer, index) => {
            elements.push({
                id: "answer-host-" + answer.id,
                displayName: currentlyShownToPlayers.answersSelectable !== null ? game.players.filter(player => player.selectedAnswerId === answer.id).length + " - " + answer.answerText + (answer.isCorrect && !currentlyShownToPlayers.answersSelectable ? ' ✓' : '') : answer.answerText,
                type: "label",
                color: getAnswerColorFromIndex(index, pictureQuestionNumberOfAnswers ?? NaN),
                reference: 'host',
                fontColor: '#FFF'
            });
        });

        elements.push({
            id: "question-details",
            displayName: "Frage " + (game.questionNumber + 1) + " / " + game.questionSet.questions.length,
            type: "label",
            color: '#000',
            reference: 'host'
        }, {
            id: "headline-players",
            displayName: game.players.filter(player => player.selectedAnswerId).length + " / " + game.players.length + " Spieler",
            type: "label",
            color: '#000',
            fontColor: '#FFF',
            reference: 'host'
        });

        game.players.forEach(player => {
            elements.push({
                id: "player-name-" + player.id,
                displayName: player.name + " - " + player.score,
                type: "label",
                color: primary,
                toolbarButton: true,
                reference: player.reference
            });
            elements.push({
                id: "player-host-" + player.id,
                displayName: player.name,
                type: "label",
                color: player.selectedAnswerId ? '#fff' : '#222',
                fontColor: player.selectedAnswerId ? '#000' : '#FFF',
                reference: 'host'
            });
        });

        if (currentlyShownToPlayers.question) {
            game.players.forEach(player => {
                elements.push({
                    id: "player-question-" + player.id,
                    displayName: game.questionSet.questions[game.questionNumber].questionText,
                    type: "label",
                    color: currentlyShownToPlayers.correctAnswerIds.length > 0 ?
                        (currentlyShownToPlayers.correctAnswerIds.includes(player.selectedAnswerId ?? -1) ? '#0F0' : '#F00')
                        : '#FFF',
                    fontColor: '#000',
                    reference: player.reference
                });
            });
        }

        if (currentlyShownToPlayers.answersSelectable !== null) {
            game.players.forEach(player => {
                game.questionSet.questions[game.questionNumber].answers.forEach((answer, index) => {
                    elements.push({
                        id: "player-answer-" + player.id + "-" + answer.id,
                        displayName: answer.answerText,
                        type: currentlyShownToPlayers.answersSelectable ? "button" : "label",
                        color: player.selectedAnswerId === answer.id ? ColorFader.adjustBrightness(getAnswerColorFromIndex(index, pictureQuestionNumberOfAnswers ?? NaN), 150) : getAnswerColorFromIndex(index, pictureQuestionNumberOfAnswers ?? NaN),
                        fontColor: player.selectedAnswerId === answer.id ? '#000' : '#FFF',
                        reference: player.reference,
                        sendUpdate: true
                    });
                });
            });
        }
        this.device.sendUIState(elements);
    }

    private getActionOfNextState(nextState: possibleStates) {
        switch (nextState) {
            case "displayQuestion":
                return "Frage anzeigen";
            case "displayPicture":
                return "Bild anzeigen";
            case "displayAnswerOptions":
                return "Antwortmöglichkeiten anzeigen";
            case "startTimer":
                return "Zeit starten";
            case "endTimer":
                return "Zeit stoppen";
            case "showWhatWasPicked":
                return "Spielerantworten anzeigen";
            case "showWhatWasPickedPicture":
                return "Spielerantworten anzeigen";
            case "showCorrectAnswers":
                return "Richtige Antworten anzeigen";
            case "displayScoreboard":
                return "Punktestand anzeigen";
            case "addScores":
                return "Punkte addieren";
            case "nextRound":
                return "Weiter";
        }
    }
}
