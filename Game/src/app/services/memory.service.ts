import { Injectable } from '@angular/core';
import { Game } from "../models/DTOs";
import { gsap } from "gsap";

@Injectable({
    providedIn: 'root'
})
export class MemoryService {
    _game?: Game;

    get game(): Game | undefined {
        return this._game;
    }

    set game(value: Game | undefined) {
        this._game = value;
        if (value) {
            gsap.set("body", {backgroundImage: `url("${value.questionSet.picturePath}")`});
        }
    }

    constructor() {
    }
}
