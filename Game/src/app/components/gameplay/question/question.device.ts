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
            if (component.id ==="continue" && component.reference === 'host') advanceState();
            if (component.id.startsWith("player-answer")) setPlayerAnswer(component);
        });
    }

    sendUiState(nextState: possibleStates, game: Game, currentlyShownToPlayers: { question: boolean; answers: boolean }): void {
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
                displayName: answer.answerText,
                type: "label",
                color: getAnswerColorFromIndex(index),
                reference: 'host',
                fontColor: '#FFF'
            });
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
        });

        if (currentlyShownToPlayers.question) {
            game.players.forEach(player => {
                elements.push({
                    id: "player-question-" + player.id,
                    displayName: game.questionSet.questions[game.questionNumber].questionText,
                    type: "label",
                    color: '#FFF',
                    fontColor: '#000',
                    reference: player.reference
                });
            });
        }

        if (currentlyShownToPlayers.answers) {
            game.players.forEach(player => {
                game.questionSet.questions[game.questionNumber].answers.forEach((answer, index) => {
                    elements.push({
                        id: "player-answer-" + player.id + "-" + answer.id,
                        displayName: answer.answerText,
                        type: "button",
                        color: player.selectedAnswerId === answer.id ? ColorFader.adjustBrightness(getAnswerColorFromIndex(index), 100) : getAnswerColorFromIndex(index),
                        fontColor: player.selectedAnswerId === answer.id ? '#000' : '#FFF',
                        reference: player.reference,
                        sendUpdate: true
                    });
                });
            });
        }

        this.device.sendUIState(elements);
    }

    private getActionOfNextState(nextState: "displayQuestion" | "displayPicture" | "displayAnswerOptions" | "startTimer") {
        switch (nextState) {
            case "displayQuestion":
                return "Frage anzeigen";
            case "displayPicture":
                return "Bild anzeigen";
            case "displayAnswerOptions":
                return "Antwortmöglichkeiten anzeigen";
            case "startTimer":
                return "Zeit starten";
        }
    }
}
