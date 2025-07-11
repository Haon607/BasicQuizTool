import { DeviceService } from "../../../services/device.service";
import { Player, TouchComponent } from "../../../models/DTOs";
import { accent, primary, secondary } from "../../../../styles";
import { convertPlayerToScoreboardPlayers } from "./scoreboard.component";

export class ScoreboardDevice {
    constructor(
        private device: DeviceService,
    ) {
    }

    sendUiState(players: Player[], questionSetName: string): void {
        let elements: TouchComponent[] = [];

        let sbPlayers = convertPlayerToScoreboardPlayers(players);

        elements.push({
                id: "host-headline",
                displayName: "Ergebnisse",
                type: "label",
                color: "#000000",
                reference: "host"
            }, {
                id: "host-setname",
                displayName: questionSetName,
                type: "label",
                color: primary,
                reference: "host"
            }
        );

        players.forEach(player => {
            elements.push({
                    id: "player-headline-" + player.id,
                    displayName: "Ergebnisse",
                    type: "label",
                    color: "#000000",
                    reference: player.reference
                }, {
                    id: "player-setname-" + player.id,
                    displayName: questionSetName,
                    type: "label",
                    color: primary,
                    reference: player.reference
                }
            );

            sbPlayers.forEach(sbP => {
                elements.push({
                    id: "player-result-" + player.id + "-" + sbP.id,
                    displayName: (sbP.placement + 1) + ". " + sbP.name + " (" + sbP.score + ")",
                    type: "label",
                    color: sbP.id === player.id ? accent : secondary,
                    reference: player.reference
                });
            });
        });

        sbPlayers.forEach(sbP => {
            elements.push({
                id: "player-host-" + sbP.id,
                displayName: (sbP.placement + 1) + ". " + sbP.name + " (" + sbP.score + ")",
                type: "label",
                color: secondary,
                reference: "host"
            });
        });

        this.device.sendUIState(elements);
    }

}
