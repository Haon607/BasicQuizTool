import { Component } from '@angular/core';
import { InfoCardComponent } from "../../subcomponents/info-card/info-card.component";
import { MemoryService } from "../../../services/memory.service";
import { Game } from "../../../models/DTOs";
import { DatabaseHttpLinkService } from "../../../services/database-http-link.service";
import { wait } from "../../../utils";
import { gsap } from "gsap";
import { Subject } from "rxjs";
import { NgStyle } from "@angular/common";

@Component({
    selector: 'app-intro.component',
    imports: [InfoCardComponent, NgStyle],
    templateUrl: './intro.component.html',
    standalone: true,
    styleUrl: './intro.component.css'
})
export class IntroComponent {
    game: Game;
    private destroy$: Subject<void> = new Subject<void>();
    private stopSpinning = false;

    constructor(private memory: MemoryService, private db: DatabaseHttpLinkService) {
        this.game = memory.game!;
        db.getGame(memory.game!.id).subscribe(game => {
            this.game = game;
            this.memory.game = game;
            this.positionPlayerCards();
            this.startCircle();
        });
    }

    positionPlayerCards(duration: number = 1) {
        const players = this.game!.players;
        const count = players.length;
        const distance = 200;

        players.forEach((player, index) => {

            // Target position
            const x = distance * index;

            const el = document.getElementById(`player-card-${player.id}`);
            if (el) {

                // Animate to the computed x/y
                gsap.to(el, {
                    x: `${x}px`,
                    y: 0,
                    duration: duration,
                    autoAlpha: players.length <= 5 ? 1 : ((index && index !== count - 1) ? 1 : 0),
                    ease: "none"
                });
            }
        });
    }

    private async startCircle() {
        while (!this.stopSpinning) {
            let duration: number = 1000;
            if (this.game!.players.length > 5) {
                this.game!.players.push(this.game!.players.shift()!);
                this.positionPlayerCards(duration / 1000);
            }
            await wait(duration);
        }
        this.stopSpinning = false;
    }
}
