import { AfterViewChecked, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DatabaseHttpLinkService } from "../../../services/database-http-link.service";
import { MemoryService } from "../../../services/memory.service";
import { Game } from "../../../models/DTOs";
import { DeviceService } from "../../../services/device.service";
import { gsap } from "gsap";
import { wait } from "../../../utils";
import { JoinDevice } from "./join.device";
import { Subject, takeUntil } from "rxjs";
import { maxPlayersNeededToNotAnimate } from "../../../../styles";

@Component({
    selector: 'app-join.game',
    standalone: true,
    imports: [],
    templateUrl: './join.component.html',
    styleUrl: './join.component.css'
})
export class JoinComponent implements AfterViewChecked, OnDestroy {
    game?: Game;
    protected showQrCodes: boolean = false;
    private deviceHandler: JoinDevice;
    private rendered = false;
    private destroy$: Subject<void> = new Subject<void>();
    private stopSpinning = false;

    constructor(
        private router: Router,
        private db: DatabaseHttpLinkService,
        private memory: MemoryService,
        private device: DeviceService,
        private activatedRouter: ActivatedRoute
    ) {
        let setId: number = Number(activatedRouter.snapshot.paramMap.get('setId')!);
        this.deviceHandler = new JoinDevice(device);
        this.device.incomingTouchComponents.pipe(takeUntil(this.destroy$)).subscribe(components => {
            this.deviceHandler.handleTabletInput(components, () => this.startGame(), () => this.toggleQrCode());
        });
        db.createGame().subscribe(game => {
            this.setupPage(game, setId);
        });
        // db.getGame(1845).subscribe(game => {
        //     for (let i = 0; i < 30; i++) {
        //         game.players.push({
        //             id: i + 100,
        //             name: Math.pow(2, i).toString(16),
        //             reference: "",
        //             score: 0,
        //         })
        //     }
        //     this.setupPage(game, setId);
        // });

        device.incomingEvents.subscribe(incomingEvent => {
            if (incomingEvent.event === 'player-joined') {
                this.db.getGame(this.game!.id).subscribe(game => {
                    const newPlayers = game.players.filter(
                        incoming => !this.game!.players.some(existing => existing.id === incoming.id)
                    );

                    this.game!.players = [...this.game!.players, ...newPlayers];
                    this.rendered = false;
                    this.deviceHandler.sendUiState(this.game!.players);
                });

            }
        });

    }

    ngAfterViewChecked() {
        if (this.game?.players && !this.rendered && this.game?.players.length <= maxPlayersNeededToNotAnimate) {
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
                    autoAlpha: players.length <= maxPlayersNeededToNotAnimate ? 1 : 0.2 * index - 0.4,
                    ease: "none"
                });
            }
        });
    }

    async startGame() {
        this.db.modifyGame(this.game!.id, {hasStarted: true}).subscribe(() => {
        });
        this.device.sendEmptyUi();
        gsap.to('#player-card-container', {scale: 0.1, autoAlpha: 0, ease: "back.in", duration: 1});
        gsap.to("#qr-code-container", {scale: 0.1, autoAlpha: 0, ease: "back.in"})
        await wait(1000);
        this.stopSpinning = true;
        gsap.to('#info-card', {scale: 0.1, autoAlpha: 0, ease: "back.in", duration: 1});
        await wait(1000);
        this.router.navigateByUrl("intro");
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    private async startCircle() {
        while (!this.stopSpinning) {
            let duration: number = 1000;
            if (this.game!.players.length > maxPlayersNeededToNotAnimate) {
                duration = 60000 / this.game!.players.length;
                this.game!.players.push(this.game!.players.shift()!);
                this.positionPlayerCardsInCircle(duration / 1000);
            }
            await wait(duration);
        }
        this.stopSpinning = false;
    }

    private setupPage(game: Game, setId: number) {
        this.db.modifyGame(game.id, {questionSet: setId}).subscribe(game => {
            this.game = game;
            this.memory.game = game;
            this.startCircle();
            this.deviceHandler.sendUiState(game.players);
            gsap.set("#qr-code-container", {scale: 0.1});
        });
    }

    private toggleQrCode() {
        this.showQrCodes = !this.showQrCodes;
        if (this.showQrCodes) gsap.to("#qr-code-container", {scale: 1, autoAlpha: 1, ease: "back.out"})
        else gsap.to("#qr-code-container", {scale: 0.1, autoAlpha: 0, ease: "back.in"})
    }
}
