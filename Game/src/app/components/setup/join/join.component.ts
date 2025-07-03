import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { DatabaseHttpLink } from "../../../services/database-http-link";
import { Memory } from "../../../services/memory";
import { Game } from "../../../models/DTOs";

@Component({
    selector: 'app-join.game',
    standalone: true,
    imports: [],
    templateUrl: './join.component.html',
    styleUrl: './join.component.css'
})
export class JoinComponent {
    game?: Game;

    constructor(private router: Router, private db: DatabaseHttpLink, private memory: Memory) {
        db.createGame().subscribe(game => {
            this.game = game;
            this.memory.game = game;
        });
    }

    startGame() {
        this.db.modifyGame(this.game!.id, {hasStarted: true}).subscribe(() => {})
    }
}
