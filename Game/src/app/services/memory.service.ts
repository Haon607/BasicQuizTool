import { Injectable } from '@angular/core';
import { Game } from "../models/DTOs";

@Injectable({
    providedIn: 'root'
})
export class MemoryService {
    game?: Game;

    constructor() {

    }
}
