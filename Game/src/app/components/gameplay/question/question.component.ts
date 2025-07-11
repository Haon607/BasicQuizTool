import { Component, OnDestroy, ViewChild } from '@angular/core';
import { InfoCardComponent } from "../../subcomponents/info-card/info-card.component";
import { dummyGame, Game, TouchComponent } from "../../../models/DTOs";
import { Subject, takeUntil } from "rxjs";
import { QuestionDevice } from "./question.device";
import { MemoryService } from "../../../services/memory.service";
import { DatabaseHttpLinkService } from "../../../services/database-http-link.service";
import { DeviceService } from "../../../services/device.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TimerComponent } from "../../subcomponents/timer/timer.component";
import { ColorFader, wait } from "../../../utils";
import { NgClass } from "@angular/common";
import { gsap } from "gsap";
import { getAnswerColorFromIndex } from "../../../../styles";
import { convertPlayerToScoreboardPlayers, ScoreboardComponent } from "../../subcomponents/scoreboard/scoreboard.component";

@Component({
    selector: 'app-question.component',
    imports: [
        InfoCardComponent,
        TimerComponent,
        NgClass,
        ScoreboardComponent
    ],
    templateUrl: './question.component.html',
    standalone: true,
    styleUrl: './question.component.css'
})
export class QuestionComponent implements OnDestroy {
    @ViewChild(TimerComponent) timer!: TimerComponent;
    @ViewChild(ScoreboardComponent) scoreboard!: ScoreboardComponent;

    protected game: Game = dummyGame;
    protected layout: 'answers' | 'pictureAndAnswers' | 'picture' = 'answers';
    protected states: possibleStates[] = [];
    protected currentlyShownToPlayers: { question: boolean, answersSelectable: boolean | null, correctAnswerIds: number[] } = {
        question: false,
        answersSelectable: null,
        correctAnswerIds: []
    };
    private destroy$ = new Subject<void>();
    private deviceHandler: QuestionDevice;

    constructor(
        private memory: MemoryService,
        private db: DatabaseHttpLinkService,
        private device: DeviceService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.deviceHandler = new QuestionDevice(device);
        this.device.incomingTouchComponents.pipe(takeUntil(this.destroy$)).subscribe(components => {
            this.deviceHandler.handleTabletInput(components, () => this.advanceState(), (component) => this.setAnswerOfPlayer(component));
        });

        const id = Number(this.activatedRoute.snapshot.paramMap.get('gameid')!);
        if (memory.game) {
            this.setGame(memory.game);
            this.setupPage();
        } else {
            this.db.getGame(id).subscribe(game => {
                this.setGame(game);
                this.memory.game = game;
                this.setupPage();
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getPictureAnswersInOrder() {
        return this.game.questionSet.questions[this.game.questionNumber].answers.slice().sort((a, b) =>
            this.game.players.filter(player => player.selectedAnswerId === b.id)!.length - this.game.players.filter(player => player.selectedAnswerId === a.id)!.length
        )
    }

    private async setGame(game: Game) {
        this.game = game;
        this.game.questionSet.questions[this.game.questionNumber].answers.sort((a, b) => a.answerText.localeCompare(b.answerText))
        const q = game.questionSet.questions[game.questionNumber];
        this.layout = q.picturePath ? (q.showAnswers ? 'pictureAndAnswers' : 'picture') : 'answers';
        this.loadFlowForLayout();

        await wait(100);
        this.scoreboard.setQuestionNumbers(game.questionNumber, game.questionSet.questions.length);
        this.setInitialGsapStates(!!q.picturePath);
    }

    private setInitialGsapStates(hasPicture: boolean) {
        gsap.set('#question-card', {x: -175, y: 400, rotate: "30deg", scale: 0.1});
        if (!(this.layout === "picture")) gsap.set('#answers-card', {scale: 0.1, rotate: "-20deg"});
        gsap.set('#timer', {scale: 0.1, y: 200});
        gsap.set('#scoreboard', {});
        if (hasPicture) {
            gsap.set('#picture-container', {scale: 0.1, rotate: "10deg"});
            if (!this.game.questionSet.questions[this.game.questionNumber].showAnswers)
                gsap.set("#answers-container", {y: 900, x: 50})
        }
    }

    private async setupPage() {
        await wait(100);
        this.updateUI();
    }

    private async advanceState() {
        const state = this.states[0];

        switch (state) {
            case 'displayQuestion':
                this.currentlyShownToPlayers.question = true;
                gsap.to('#question-card', {rotateZ: -2, scale: 1.2, ease: "back.out", autoAlpha: 1});
                break;

            case 'displayPicture':
                await this.animateIn('#question-card', {x: 0, y: 0, rotate: "2deg", scale: 1});
                await this.animateIn('#picture-container', {x: 0, y: 0, rotate: "-1deg", scale: 1});
                if (this.layout === 'picture') this.currentlyShownToPlayers.answersSelectable = true;
                break;

            case 'displayAnswerOptions':
                await this.animateIn('#question-card', {x: 0, y: 0, rotate: "2deg", scale: 1});
                await this.animateIn('#answers-card', {scale: 1, rotate: 0});
                this.currentlyShownToPlayers.answersSelectable = true;
                break;

            case 'startTimer':
                this.timer.startTimer(() => this.advanceState());
                break;

            case 'endTimer':
                this.timer.stopTimer();
                this.currentlyShownToPlayers.answersSelectable = false;
                this.updateUI();
                await wait(1500);
                gsap.to('#timer', {scale: 0.1, y: 200, ease: "back.in"});
                break;

            case 'showWhatWasPicked':
                this.setGradientOnAnswers();
                break;

            case 'showWhatWasPickedPicture':
                gsap.to("#answers-container", {y: 0, x: 1, autoAlpha: 1, rotate: "-1deg", ease: "back.out"})
                gsap.to("#picture-container", {width: "70%", x: 250, rotate: "1deg", ease: "back.out"})
                this.setGradientOnAnswers(true);
                break;

            case 'showCorrectAnswers':
                this.currentlyShownToPlayers.correctAnswerIds = this.getCorrectAnswerIds();
                if (this.game.questionSet.questions[this.game.questionNumber].revealPicturePath) {
                    gsap.to("#picture-container", {scale: 0.1, autoAlpha: 0, duration: 0.5, ease: "back.in"})
                    await wait(500)
                    this.game.questionSet.questions[this.game.questionNumber].picturePath = this.game.questionSet.questions[this.game.questionNumber].revealPicturePath
                    gsap.to("#picture-container", {scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out"})
                }
                this.lightCorrectAnswersUp(!!this.game.questionSet.questions[this.game.questionNumber].picturePath && !this.game.questionSet.questions[this.game.questionNumber].showAnswers);
                break;

            case 'displayScoreboard':
                gsap.to('#scoreboard', {autoAlpha: 1, duration: 1, ease: "back.out"});
                await wait(1000);
                this.scoreboard.setPlayers(convertPlayerToScoreboardPlayers(this.game.players), false);
                await wait(1000);
                this.scoreboard.setPlayers(convertPlayerToScoreboardPlayers(this.game.players, this.getCorrectAnswerIds()), true);
                break;

            case 'addScores':
                const correctIds = this.getCorrectAnswerIds();
                this.game.players.forEach(player => {
                    if (correctIds.includes(player.selectedAnswerId ?? -1)) player.score++;
                });
                this.sortAndDisplayScores(correctIds);
                break;

            case 'nextRound':
                await this.hideUIElements();
                this.game.questionNumber++;
                this.game.players.forEach(player => {
                    this.db.setPlayerScore(player.id, player.score).subscribe(() => {
                    });
                });
                this.db.modifyGame(this.game.id, {'questionNumber': this.game.questionNumber}).subscribe(() => {
                    this.router.navigateByUrl('dummy', {skipLocationChange: true}).then(() => {
                        if (this.game.questionNumber < this.game.questionSet.questions.length) this.router.navigateByUrl('question/' + this.game.id)
                        else this.router.navigateByUrl('scoreboard/' + this.game.id);
                    });
                });
                return;
        }

        if (this.states[0] === 'startTimer') this.updateUI();
        this.states.shift();

        if (this.states[0] === 'startTimer') {
            await wait(500);
            gsap.to('#timer', {scale: 1, y: 0, autoAlpha: 1, ease: "back.out"});
            await this.timer.setupTimer();
        }

        this.updateUI();
    }

    private async animateIn(selector: string, animation: Record<string, any>) {
        // await wait(500);
        gsap.to(selector, {autoAlpha: 1, ease: "back.out", ...animation});
    }

    private updateUI() {
        this.deviceHandler.sendUiState(this.states[0], this.game, this.currentlyShownToPlayers,
            (this.game.questionSet.questions[this.game.questionNumber].picturePath && !this.game.questionSet.questions[this.game.questionNumber].showAnswers) ? this.game.questionSet.questions[this.game.questionNumber].answers.length : null);
    }

    private loadFlowForLayout() {
        const flowMap: Record<typeof this.layout, possibleStates[]> = {
            answers: ['displayQuestion', 'displayAnswerOptions', 'startTimer', 'endTimer', 'showWhatWasPicked', 'showCorrectAnswers', 'displayScoreboard', 'addScores', 'nextRound'],
            pictureAndAnswers: ['displayQuestion', 'displayPicture', 'displayAnswerOptions', 'startTimer', 'endTimer', 'showWhatWasPicked', 'showCorrectAnswers', 'displayScoreboard', 'addScores', 'nextRound'],
            picture: ['displayQuestion', 'displayPicture', 'startTimer', 'endTimer', 'showWhatWasPickedPicture', 'showCorrectAnswers', 'displayScoreboard', 'addScores', 'nextRound'],
        };
        this.states = flowMap[this.layout];
    }

    private setAnswerOfPlayer(pressedButton: TouchComponent) {
        const player = this.game.players.find(p => p.reference === pressedButton.reference);
        if (player) player.selectedAnswerId = Number(pressedButton.id.split('-')[3]);
        this.updateUI();
    }

    private getCorrectAnswerIds(): number[] {
        return this.game.questionSet.questions[this.game.questionNumber].answers
            .filter(a => a.isCorrect)
            .map(a => a.id);
    }

    private setGradientOnAnswers(colorOnSpectrum: boolean = false) {
        const total = this.game.players.length;
        this.game.questionSet.questions[this.game.questionNumber].answers.forEach((answer, i) => {
            const count = this.game.players.filter(p => p.selectedAnswerId === answer.id).length;
            const percent = (count / total) * 100;
            const color = getAnswerColorFromIndex(i, colorOnSpectrum ? this.game.questionSet.questions[this.game.questionNumber].answers.length : NaN);
            const faded = ColorFader.adjustBrightness(color, -50);
            gsap.to(`#answer-${answer.id}`, {
                background: `linear-gradient(90deg, ${color}, ${color} ${percent}%, ${faded} ${percent}%)`
            });
        });
    }

    private lightCorrectAnswersUp(colorOnSpectrum: boolean = false) {
        const total = this.game.players.length;
        this.game.questionSet.questions[this.game.questionNumber].answers.forEach((answer, i) => {
            const count = this.game.players.filter(p => p.selectedAnswerId === answer.id).length;
            const percent = (count / total) * 100;
            const color = getAnswerColorFromIndex(i, colorOnSpectrum ? this.game.questionSet.questions[this.game.questionNumber].answers.length : NaN);
            const gradient = answer.isCorrect
                ? `linear-gradient(90deg, ${ColorFader.adjustBrightness(color, 75)}, ${ColorFader.adjustBrightness(color, 100)} ${percent}%, ${ColorFader.adjustBrightness(color, 0)} ${percent}%)`
                : `linear-gradient(90deg, ${ColorFader.adjustBrightness(color, -25)}, ${ColorFader.adjustBrightness(color, -50)} ${percent}%, ${ColorFader.adjustBrightness(color, -75)} ${percent}%)`;

            gsap.to(`#answer-${answer.id}`, {background: gradient});
        });
    }

    private async sortAndDisplayScores(correctIds: number[]) {
        this.scoreboard.setPlayers(convertPlayerToScoreboardPlayers(this.game.players, correctIds), true);
        await wait(1000);
        this.game.players.sort((a, b) => b.score - a.score);
        this.scoreboard.setPlayers(convertPlayerToScoreboardPlayers(this.game.players, correctIds), true);
        await wait(1000);
        this.scoreboard.setPlayers(convertPlayerToScoreboardPlayers(this.game.players, correctIds), false);
    }

    private async hideUIElements() {
        gsap.to('#scoreboard', {scale: 0.1, autoAlpha: 0, ease: "back.in"});
        await wait(250);
        gsap.to('#answers-card', {scale: 0.1, autoAlpha: 0, ease: "back.in"});
        if (this.game.questionSet.questions[this.game.questionNumber].picturePath) {
            await wait(250);
            gsap.to('#picture-container', {scale: 0.1, autoAlpha: 0, ease: "back.in"});
            if (!this.game.questionSet.questions[this.game.questionNumber].showAnswers) {
                await wait(250);
                gsap.to("#answers-container", {y: 900, x: 50, autoAlpha: 0, scale: 0.1, ease: 'back.in'});
            }
        }
        await wait(250);
        gsap.to('#question-card', {scale: 0.1, autoAlpha: 0, ease: "back.in"});
        await wait(1000);
    }
}

export type possibleStates =
    | 'displayQuestion'
    | 'displayPicture'
    | 'displayAnswerOptions'
    | 'startTimer'
    | 'endTimer'
    | 'showWhatWasPicked'
    | 'showWhatWasPickedPicture'
    | 'showCorrectAnswers'
    | 'displayScoreboard'
    | 'addScores'
    | 'nextRound';
