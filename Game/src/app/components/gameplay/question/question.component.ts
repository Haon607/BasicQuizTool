import { Component, ViewChild } from '@angular/core';
import { InfoCardComponent } from "../../subcomponents/info-card/info-card.component";
import { Game, TouchComponent } from "../../../models/DTOs";
import { Subject, takeUntil } from "rxjs";
import { QuestionDevice } from "./question.device";
import { MemoryService } from "../../../services/memory.service";
import { DatabaseHttpLinkService } from "../../../services/database-http-link.service";
import { DeviceService } from "../../../services/device.service";
import { Router } from "@angular/router";
import { TimerComponent } from "../../subcomponents/timer/timer.component";
import { wait } from "../../../utils";
import { NgClass } from "@angular/common";
import { gsap } from "gsap";

@Component({
    selector: 'app-question.component',
    imports: [
        InfoCardComponent,
        TimerComponent,
        NgClass
    ],
    templateUrl: './question.component.html',
    standalone: true,
    styleUrl: './question.component.css'
})
export class QuestionComponent {
    @ViewChild(TimerComponent) timer!: TimerComponent;
    protected game: Game;
    protected layout: 'answers' | 'pictureAndAnswers' | 'picture' = 'answers';
    protected states: possibleStates[] = [];
    protected currentlyShownToPlayers: { question: boolean, answers: boolean } = {question: false, answers: false};
    private destroy$: Subject<void> = new Subject<void>();
    private deviceHandler: QuestionDevice;

    constructor(
        private memory: MemoryService,
        private db: DatabaseHttpLinkService,
        private device: DeviceService,
        private router: Router
    ) {
        this.deviceHandler = new QuestionDevice(device);
        this.game = memory.game!;
        this.device.incomingTouchComponents.pipe(takeUntil(this.destroy$)).subscribe(components => {
            this.deviceHandler.handleTabletInput(components, () => this.advanceState(), (component) => this.setAnswerOfPlayer(component));
        });
        db.getGame(memory.game!.id).subscribe(game => {
            this.setGame(game);
            this.memory.game = game;
            this.setupPage()
        });
        // this.setupPage();
    }

    private async setGame(game: Game) {
        this.game = game;
        this.layout = game.questionSet.questions[game.questionNumber].picturePath ? (game.questionSet.questions[game.questionNumber].showAnswers ? 'pictureAndAnswers' : 'picture') : 'answers';
        this.loadFlowForLayout();

        await wait(100);

        gsap.set('#question-card', {x: -175, y: 400, rotate: "30deg", scale: 0.1});
        gsap.set('#answers-card', {scale: 0.1, rotate: "-20deg"})
        gsap.set('#timer', {scale: 0.1, y: 200})
        if (game.questionSet.questions[game.questionNumber].picturePath) gsap.set('#picture-container', {scale: 0.1, rotate: "10deg"})
    }

    private async setupPage() {
        await wait(100);

        this.deviceHandler.sendUiState(this.states[0], this.game, this.currentlyShownToPlayers);
    }

    private async advanceState() {
        switch (this.states[0]) {
            case 'displayQuestion':
                this.currentlyShownToPlayers.question = true;
                gsap.to('#question-card', {rotateZ: -2, scale: 1.2, ease: "back.out", autoAlpha: 1});
                break;
            case 'displayPicture':
                gsap.to('#question-card', {x: 0, y: 0, rotate: "2deg", scale: 1, ease: "back.out"});
                await wait(500);
                gsap.to('#picture-container', {x: 0, y: 0, autoAlpha: 1, rotate: "-1deg", scale: 1, ease: "back.out"});
                if (this.layout === 'picture') this.currentlyShownToPlayers.answers = true;
                break;
            case 'displayAnswerOptions':
                gsap.to('#question-card', {x: 0, y: 0, rotate: "2deg", scale: 1, ease: "back.out"});
                await wait(500);
                gsap.to('#answers-card', {scale: 1, rotate: 0, autoAlpha: 1, ease: "back.out"})
                this.currentlyShownToPlayers.answers = true;
                break;
            case 'startTimer':
                this.timer.startTimer();
        }
        this.states.shift();
        if(this.states[0] === 'startTimer') {
            await wait(500);
            gsap.to('#timer', {scale: 1, y: 0, autoAlpha: 1, ease: "back.out"})
            await this.timer.setupTimer();
        }
        this.deviceHandler.sendUiState(this.states[0], this.game, this.currentlyShownToPlayers);
    }

    private loadFlowForLayout() {
        switch (this.layout) {
            case 'answers':
                this.states = ['displayQuestion', 'displayAnswerOptions', 'startTimer'];
                break;
            case 'pictureAndAnswers':
                this.states = ['displayQuestion', 'displayPicture', 'displayAnswerOptions', 'startTimer'];
                break;
            case 'picture':
                this.states = ['displayQuestion', 'displayPicture', 'startTimer'];
                break;
        }
    }

    private setAnswerOfPlayer(pressedButton: TouchComponent) {
        this.game.players.filter(player => player.reference === pressedButton.reference)[0].selectedAnswerId = Number(pressedButton.id.split('-')[3]);
        this.deviceHandler.sendUiState(this.states[0], this.game, this.currentlyShownToPlayers);
    }
}

export type possibleStates = 'displayQuestion' | 'displayPicture' | 'displayAnswerOptions' | 'startTimer' ;