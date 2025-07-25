import { DeviceService } from "../../../services/device.service";
import { Player, TouchComponent } from "../../../models/DTOs";
import { accent, primary, secondary } from "../../../../styles";

export class JoinDevice {
    constructor(
        private device: DeviceService,
    ) {
    }

    handleTabletInput(components: TouchComponent[], startGameCallback: () => void, toggleQrCodes: () => void) {
        components.filter(component => component.pressed && component.reference === 'host').forEach(component => {
            switch (component.id) {
                case "startgame":
                    startGameCallback();
                    this.device.sendEmptyUi();
                    break;
                case "toggleqrcodes":
                    toggleQrCodes();
                    break;
            }
        });
    }

    sendUiState(players: Player[]): void {
        let elements: TouchComponent[] = [
            {
                id: "toggleqrcodes",
                displayName: "Qr-Codes",
                type: "button",
                sendUpdate: true,
                toolbarButton: true,
                color: secondary,
                reference: 'host'
            },{
                id: "startgame",
                displayName: "Spiel starten",
                // disabled: players.length <= 1,
                type: "button",
                sendUpdate: true,
                toolbarButton: true,
                color: accent,
                reference: 'host'
            }
        ];

        players.forEach(player => {
            elements.push({
                id: "player-label-" + player.id,
                displayName: "Du bist drinnen! " + player.name,
                type: "label",
                color: primary,
                reference: player.reference
            });
            elements.push({
                id: "player-host-" + player.id,
                displayName: player.name,
                type: "label",
                color: primary,
                reference: 'host'
            });
        });

        this.device.sendUIState(elements);
    }
}
