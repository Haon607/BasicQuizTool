import { AfterViewChecked, Component, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { DatabaseHttpLinkService } from "../../../services/database-http-link.service";
import { MemoryService } from "../../../services/memory.service";
import { Game } from "../../../models/DTOs";
import { DeviceService } from "../../../services/device.service";
import { gsap } from "gsap";
import { wait } from "../../../utils";
import { JoinDevice } from "./join.device";
import { count, Subject, takeUntil } from "rxjs";

@Component({
    selector: 'app-join.game',
    standalone: true,
    imports: [],
    templateUrl: './join.component.html',
    styleUrl: './join.component.css'
})
export class JoinComponent implements AfterViewChecked, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    private deviceHandler: JoinDevice;
    game?: Game;
    private rendered = false;
    private stopSpinning = false;

    constructor(private router: Router, private db: DatabaseHttpLinkService, private memory: MemoryService, private device: DeviceService) {
        this.deviceHandler = new JoinDevice(device);
        this.device.incomingTouchComponents.pipe(takeUntil(this.destroy$)).subscribe(components => {
           this.deviceHandler.handleTabletInput(components, () => this.startGame());
        });
        // db.createGame().subscribe(game => {
        //     this.game = game;
        //     this.memory.game = game;
        // this.startCircle();
        // this.deviceHandler.sendUiState(game.players);
        // });
        db.getGame(1845).subscribe(game => {
            for (let i = 0; i < 30; i++) {
                game.players.push({
                    id: i + 100,
                    name: Math.pow(2, i).toString(16),
                    reference: "",
                    score: 0,
                })
            }
            this.game = game;
            this.memory.game = game;
            this.startCircle();
            this.deviceHandler.sendUiState(game.players);
        });

        device.incomingEvents.subscribe(incomingEvent => {
            if (incomingEvent.event === 'player-joined') {
                this.db.getGame(this.game!.id).subscribe(game => {
                    this.game = game;
                    this.rendered = false; // trigger re-animation
                    this.deviceHandler.sendUiState(game.players);
                });
            }
        });

    }

    ngAfterViewChecked() {
        if (this.game?.players && !this.rendered) {
            this.rendered = true;
            this.positionPlayerCardsInCircle();
        }
    }

    positionPlayerCardsInCircle(duration: number = 1) {
        const players = this.game!.players;
        const count = players.length;
        const radius = 500;
        const centerX = 0;
        const centerY = 0;

        players.forEach((player, index) => {
            // Evenly spaced angles around the circle
            const angle = (index / count) * Math.PI * 2;

            // Target position
            const x = centerX + radius * Math.cos(angle) * 1.5;
            const y = centerY + radius * Math.sin(angle) * 0.9;

            const el = document.getElementById(`player-card-${player.id}`);
            if (el) {

                // Animate to the computed x/y
                gsap.to(el, {
                    x: `${x}px`,
                    y: `${y}px`,
                    duration: duration,
                    autoAlpha: 0.2 * index - 0.4,
                    ease: "none"
                });
            }
        });
    }

    startGame() {
        this.db.modifyGame(this.game!.id, {hasStarted: true}).subscribe(() => {
        });
    }

    private async startCircle() {
        while (!this.stopSpinning) {
            let duration: number = 1000;
            if (this.game!.players.length > 2) {
                duration = 60000 / this.game!.players.length;
                this.game!.players.push(this.game!.players.shift()!);
                this.positionPlayerCardsInCircle(duration / 1000);
            }
            await wait(duration);
        }
        this.stopSpinning = false;
    }

    ngOnDestroy(): void {
    }
}
