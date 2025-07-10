import { Component, Input } from '@angular/core';
import { countWithDelay, wait } from "../../../utils";
import { gsap } from "gsap";

@Component({
    selector: 'app-timer',
    imports: [],
    templateUrl: './timer.component.html',
    standalone: true,
    styleUrl: './timer.component.css'
})
export class TimerComponent {
    @Input() maxTime!: number;
    protected timeLeft: number = 0;
    protected textSmaller: boolean = false;
    protected timerRunning: boolean = false;

    constructor() {
    }

    public async setupTimer() {
        if (this.timerRunning && this.timeLeft > 0) return
        this.timerRunning = false;
        gsap.to("#timer-bar", {width: 100 + "%", duration: 3, ease: "power1.out"});
        countWithDelay(this.timeLeft, this.maxTime, 2500, value => {
            this.timeLeft = value;
            this.checkFontSize();
        });
        await wait(3000);
    }

    public async startTimer(timeOutCallback: () => void) {
        if (this.timerRunning) return;
        this.timerRunning = true;

        while (this.timerRunning && this.timeLeft > 0) {
            this.timeLeft--;

            const widthPercent = this.getBarLengthInPercent();
            gsap.to("#timer-bar", {
                width: `${widthPercent}%`,
                ease: "power2.out",
                duration: 1
            });

            await wait(1000);
        }

        if (this.timerRunning) timeOutCallback();

        this.timerRunning = false;
    }

    private getBarLengthInPercent(): number {
        const progress = this.timeLeft / this.maxTime; // from 1 to 0
        const minWidth = 5;
        const maxWidth = 100;
        return minWidth + progress * (maxWidth - minWidth); // 5% at 0, 100% at full time
    }

    private checkFontSize() {
        if (this.timeLeft > 99 && !this.textSmaller) {
            this.textSmaller = true;
            gsap.to("#timer-text-value", {scale: 0.8});
        } else if (this.timeLeft <= 99 && this.textSmaller) {
            this.textSmaller = false;
            gsap.to("#timer-text-value", {scale: 1});
        }
    }

    stopTimer() {
        this.timerRunning = false;
    }
}
