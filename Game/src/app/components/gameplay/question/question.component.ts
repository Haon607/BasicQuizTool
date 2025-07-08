import { Component, ViewChild } from '@angular/core';
import { InfoCardComponent } from "../../subcomponents/info-card/info-card.component";
import { Game } from "../../../models/DTOs";
import { Subject, takeUntil } from "rxjs";
import { QuestionDevice } from "./question.device";
import { MemoryService } from "../../../services/memory.service";
import { DatabaseHttpLinkService } from "../../../services/database-http-link.service";
import { DeviceService } from "../../../services/device.service";
import { Router } from "@angular/router";
import { TimerComponent } from "../../subcomponents/timer/timer.component";
import { wait } from "../../../utils";
import { NgClass } from "@angular/common";

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
    protected layout: 'answers' | 'pictureAndAnswers' | 'picture' = 'pictureAndAnswers';
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
        this.setGame(memory.game!);
        this.device.incomingTouchComponents.pipe(takeUntil(this.destroy$)).subscribe(components => {
            this.deviceHandler.handleTabletInput(components, () => {
            });
        });
        db.getGame(memory.game!.id).subscribe(game => {
            this.setGame(game);
            this.memory.game = game;
            this.setupPage()
        });
        // this.setupPage();
    }

    private setGame(game: Game) {
        this.game = game;
        this.layout = game.questionSet.questions[game.questionNumber].picturePath ? (game.questionSet.questions[game.questionNumber].showAnswerOptions ? 'pictureAndAnswers' : 'picture') : 'answers'
    }

    private async setupPage() {
        await wait(100);


        this.timer.setupTimer()
        await wait(5000)
        this.timer.startTimer()
    }
}
