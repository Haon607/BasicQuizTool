import { Component, OnDestroy } from '@angular/core';
import { InfoCardComponent } from "../../subcomponents/info-card/info-card.component";
import { MemoryService } from "../../../services/memory.service";
import { Game } from "../../../models/DTOs";
import { DatabaseHttpLinkService } from "../../../services/database-http-link.service";
import { wait } from "../../../utils";
import { gsap } from "gsap";
import { Subject, takeUntil } from "rxjs";
import { NgStyle } from "@angular/common";
import { DeviceService } from "../../../services/device.service";
import { IntroDevice } from "./intro.device";
import { Router } from "@angular/router";

@Component({
    selector: 'app-intro.component',
    imports: [InfoCardComponent, NgStyle],
    templateUrl: './intro.component.html',
    standalone: true,
    styleUrl: './intro.component.css'
})
export class IntroComponent implements OnDestroy{
    protected game: Game;
    private destroy$: Subject<void> = new Subject<void>();
    private stopSpinning = false;
    private deviceHandler: IntroDevice;

    constructor(
        private memory: MemoryService,
        private db: DatabaseHttpLinkService,
        private device: DeviceService,
        private router: Router
    ) {
        this.deviceHandler = new IntroDevice(device);
        this.game = memory.game!;
        this.device.incomingTouchComponents.pipe(takeUntil(this.destroy$)).subscribe(components => {
            this.deviceHandler.handleTabletInput(components, () => this.startGame());
        });
        db.getGame(memory.game!.id).subscribe(game => {
            this.game = game;
            this.memory.game = game;
            this.deviceHandler.sendUiState(game.players, game);
            this.positionPlayerCards();
            this.startCircle();
            this.animatePageOpening();
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

    private async animatePageOpening() {
        await wait(100);
        gsap.set('#player-card-container', {y: 500});
        gsap.set('#info-card', {x: -250, y: -250, rotateZ: -80});
        gsap.set('#set-container-container', {scale: 0.1});

        gsap.to('#info-card', {x: 0, y: 0, rotateZ: "-5deg", autoAlpha: 1, duration: 0.5});
        gsap.to("#set-container-container", {scale: 1, autoAlpha: 1, ease: "back.out"});
        await wait(2000);
        gsap.to('#player-card-container', {y: 0, autoAlpha: 1});
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    private async startGame() {
        this.stopSpinning = true;
        this.device.sendEmptyUi();
        gsap.to("#set-container-container", {scale: 0.1, autoAlpha: 0, ease: "back.in"});
        gsap.to(".player-card", {x: -250, duration: 1, ease: "power3.in"});
        await wait(1000);
        this.router.navigateByUrl("question/" + this.game.questionNumber+1)
    }
}
