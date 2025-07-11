import { AfterViewInit, Component } from '@angular/core';
import { Game, Player } from "../../../models/DTOs";
import gsap from "gsap";
import { wait } from "../../../utils";
import { secondary } from "../../../../styles";
import { ActivatedRoute } from "@angular/router";
import { MemoryService } from "../../../services/memory.service";
import { DatabaseHttpLinkService } from "../../../services/database-http-link.service";
import { DeviceService } from "../../../services/device.service";
import { ScoreboardDevice } from "./scoreboard.device";

@Component({
    selector: 'app-scoreboard',
    imports: [],
    templateUrl: './scoreboard.component.html',
    standalone: true,
    styleUrl: './scoreboard.component.css'
})
export class ScoreboardComponent implements AfterViewInit {
    protected players: ScoreboardPlayer[] = [];
    protected currentQuestionNumber: number = 0;
    protected totalQuestionNumber: number = 0;
    private deviceHandler: ScoreboardDevice;
    protected setName: string = "";

    constructor(private route: ActivatedRoute, private memory: MemoryService, private db: DatabaseHttpLinkService, private device: DeviceService) {
        this.deviceHandler = new ScoreboardDevice(device);
    }

    ngAfterViewInit() {
        if (this.route.component === this.constructor) {
            const id = Number(this.route.snapshot.paramMap.get('gameid')!);
            if (this.memory.game) {
                this.fillScoreboardWithGameData(this.memory.game);
            } else {
                this.db.getGame(id).subscribe(game => {
                    this.memory.game = game;
                    this.fillScoreboardWithGameData(game);
                });
            }
            this.setPlayers(convertPlayerToScoreboardPlayers(this.memory.game!.players), false)
        }
    }

    public setQuestionNumbers(currentQuestionNumber: number, totalQuestionNumber: number) {
        this.currentQuestionNumber = currentQuestionNumber;
        this.totalQuestionNumber = totalQuestionNumber;
        gsap.set('#question-number-card', {scale: 0.1});
    }

    public setSet(setName: string) {
        this.setName = setName;
        gsap.set('#set-container-container', {scale: 0.1});
        gsap.to('#set-container-container', {scale: 1, rotate: "-87deg", autoAlpha: 1, ease: "back.out"});
    }

    public setPlayers(players: ScoreboardPlayer[], hasCorrect: boolean) {
        this.players = players;
        this.updatePlayers(hasCorrect);
        gsap.to('#question-number-card', {scale: 1, rotate: this.route.component === this.constructor ? "-2deg" : "2deg", autoAlpha: 1, ease: "back.out"});
    }

    private async updatePlayers(hasCorrect: boolean) {
        await wait(100);
        gsap.set('#question-number-card', {scale: 0.1});
        gsap.to('#question-number-card', {scale: 1, autoAlpha: 1, ease: "back.out"});
        for (const player of this.players) {
            if (this.players.length <= 14) this.excel14Placement(player, player.placement, this.players.find(p => p.placement === 0)?.score === player.score, hasCorrect);
            else if (this.players.length <= 24) this.excel24Placement(player, player.placement, this.players.find(p => p.placement === 0)?.score === player.score, hasCorrect);
            else if (this.players.length <= 40) this.excel40Placement(player, player.placement, this.players.find(p => p.placement === 0)?.score === player.score, hasCorrect);
            else if (this.players.length <= 65) this.excel65Placement(player, player.placement, this.players.find(p => p.placement === 0)?.score === player.score, hasCorrect);
            else if (this.players.length <= 90) this.excel90Placement(player, player.placement, this.players.find(p => p.placement === 0)?.score === player.score, hasCorrect);
            else if (this.players.length <= 160) this.excel160Placement(player, player.placement, this.players.find(p => p.placement === 0)?.score === player.score, hasCorrect);
            else this.excel40Placement(player, player.placement, this.players.find(p => p.placement === 0)?.score === player.score, hasCorrect);
        }
    }

    private excel14Placement(player: ScoreboardPlayer, i: number, isOnTopPlace: boolean, hasCorrect: boolean) {
        this.placeEntryPerExcelWith(player.id, i, 1.2, -250, 650, -450, 150, 7, player.isCorrect, isOnTopPlace, hasCorrect)
    }

    private excel24Placement(player: ScoreboardPlayer, i: number, isOnTopPlace: boolean, hasCorrect: boolean) {
        this.placeEntryPerExcelWith(player.id, i, 1, -380, 520, -450, 130, 8, player.isCorrect, isOnTopPlace, hasCorrect)
    }

    private excel40Placement(player: ScoreboardPlayer, i: number, isOnTopPlace: boolean, hasCorrect: boolean) {
        this.placeEntryPerExcelWith(player.id, i, 0.75, -450, 395, -450, 100, 10, player.isCorrect, isOnTopPlace, hasCorrect)
    }

    private excel65Placement(player: ScoreboardPlayer, i: number, isOnTopPlace: boolean, hasCorrect: boolean) {
        this.placeEntryPerExcelWith(player.id, i, 0.6, -470, 310, -480, 80, 13, player.isCorrect, isOnTopPlace, hasCorrect)
    }

    private excel90Placement(player: ScoreboardPlayer, i: number, isOnTopPlace: boolean, hasCorrect: boolean) {
        this.placeEntryPerExcelWith(player.id, i, 0.5, -500, 260, -490, 70, 15, player.isCorrect, isOnTopPlace, hasCorrect)
    }

    private excel160Placement(player: ScoreboardPlayer, i: number, isOnTopPlace: boolean, hasCorrect: boolean) {
        this.placeEntryPerExcelWith(player.id, i, 0.4, -570, 203, -515, 54, 20, player.isCorrect, isOnTopPlace, hasCorrect)
    }

    private placeEntryPerExcelWith(playerId: number, i: number, scale: number, initX: number, xDisplacement: number, initY: number, yDisplacement: number, elementsPerColumn: number, isCorrect: boolean, isOnTopPlace: boolean, hasCorrect: boolean) {
        gsap.set('#player-card-' + playerId, {zIndex: this.players.length - i});
        gsap.to('#player-card-' + playerId,
            {
                x: initX + (xDisplacement * Math.floor(i / elementsPerColumn)),
                y: initY + ((i - (elementsPerColumn * Math.floor(i / elementsPerColumn))) * yDisplacement),
                rotate: 0,
                autoAlpha: 1,
                scale: scale,
                outline: hasCorrect ? (isCorrect ? "#0F0 20px solid" : secondary + " 20px solid") : (isOnTopPlace ? "#FFF 20px solid" : secondary + " 20px solid"),
                ease: "power1",
            }
        );
    }

    private async fillScoreboardWithGameData(game: Game) {
        this.setQuestionNumbers(game.questionNumber - 1, game.questionSet.questions.length);
        game.players.sort((a, b) => b.score - a.score);
        this.setSet(game.questionSet.name);
        this.setPlayers(convertPlayerToScoreboardPlayers(game.players), false);
        this.deviceHandler.sendUiState(game.players, game.questionSet.name);
    }
}

export interface ScoreboardPlayer {
    id: number;
    name: string;
    score: number;
    isCorrect: boolean;
    placement: number;
}

export function convertPlayerToScoreboardPlayers(player: Player[], correctAnswerIds?: number[]): ScoreboardPlayer[] {
    return player.map((player, index) => {
        return {
            id: player.id,
            isCorrect: correctAnswerIds ? (correctAnswerIds.includes(player.selectedAnswerId ?? -1)) : false,
            score: player.score,
            placement: index,
            name: player.name,
        }
    })
}
