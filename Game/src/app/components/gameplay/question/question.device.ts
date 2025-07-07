import { DeviceService } from "../../../services/device.service";
import { Game, Player, TouchComponent } from "../../../models/DTOs";
import { accent, primary, secondary } from "../../../../styles";

export class QuestionDevice {
    constructor(
        private device: DeviceService,
    ) {
    }

    handleTabletInput(components: TouchComponent[], startGameCallback: () => void) {
        components.filter(component => component.pressed && component.reference === 'host').forEach(component => {
            switch (component.id) {
                case "continue":
                    startGameCallback();
                    break;
            }
        });
    }

    sendUiState(players: Player[], game: Game): void {
        let elements: TouchComponent[] = [
            {
                id: "continue",
                displayName: "Weiter",
                disabled: players.length <= 1,
                type: "button",
                sendUpdate: true,
                toolbarButton: true,
                color: primary,
                reference: 'host'
            },{
                id: "headline-gameinfo",
                displayName: "Spielinfo",
                type: "label",
                color: primary,
                reference: 'host'
            },{
                id: "setname",
                displayName: game.questionSet.name,
                type: "label",
                color: secondary,
                reference: 'host'
            },{
                id: "setquestionsnumber",
                displayName: game.questionSet.questions.length + " Fragen",
                type: "label",
                color: secondary,
                reference: 'host'
            },{
                id: "headline-players",
                displayName: players.length + " Spieler",
                type: "label",
                color: primary,
                reference: 'host'
            },
        ];

        players.forEach(player => {
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
                color: accent,
                reference: 'host'
            });
        });

        this.device.sendUIState(elements);
    }
}
