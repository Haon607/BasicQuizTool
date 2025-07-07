import { Injectable } from '@angular/core';
import { Game } from "../models/DTOs";

@Injectable({
    providedIn: 'root'
})
export class MemoryService {
    game?: Game;

    constructor() {
        this.game = {
            "id": 1845,
            "players": [
                {"id": 159, "name": "556", "reference": "6deb8b64-5210-4fe1-8a7e-70d212debc68", "score": 0}, {"id": 160, "name": "58554", "reference": "6260aa2b-e494-4b90-a61c-a7d972561424", "score": 0}, {"id": 161, "name": "adasdadasd", "reference": "52a008e7-3976-4c16-8caf-f37c9670efe9", "score": 0}, {"id": 162, "name": "jhk", "reference": "4f98d628-0771-4dfd-947d-0f530ee340d6", "score": 0}, {"id": 163, "name": "dsf", "reference": "ae243c5a-6b61-4ddd-9b26-2411a571ad00", "score": 0}, {"id": 164, "name": "adasd", "reference": "f0e379c3-9256-4332-9ba8-12a896ba8df4", "score": 0}, {"id": 165, "name": "adsdasd", "reference": "a8fffd2e-ad87-46e9-b5cd-478eaba5fe07", "score": 0}, {"id": 166, "name": "sadasda", "reference": "573fe978-a7ba-48c6-891b-882803609726", "score": 0}, {"id": 167, "name": "4456546546546", "reference": "c16489d3-02d3-414c-ae25-f9b1391e00d4", "score": 0}, {"id": 168, "name": "55555", "reference": "2bc89f61-a648-44bf-a4f7-a9b33214c436", "score": 0}, {
                    "id": 202,
                    "name": "ad",
                    "reference": "3f8d867e-9664-42bc-8498-0e5505f2af5a",
                    "score": 0
                }, {"id": 203, "name": "Test", "reference": "e7345a1e-3861-4552-8a03-18acdc712ce3", "score": 0}, {"id": 204, "name": "1", "reference": "c8eb00bd-fdea-4385-b2ac-72168da2ebc8", "score": 0}],
            "touchComponents": [{"id": "startgame", "displayName": "Spiel starten", "disabled": false, "type": "button", "sendUpdate": true, "toolbarButton": true, "color": "#8ac873", "reference": "host"}, {"id": "player-label-160", "displayName": "Du bist drinnen! 58554", "type": "label", "color": "#a64cb8", "reference": "6260aa2b-e494-4b90-a61c-a7d972561424"}, {"id": "player-host-160", "displayName": "58554", "type": "label", "color": "#a64cb8", "reference": "host"}, {"id": "player-label-161", "displayName": "Du bist drinnen! adasdadasd", "type": "label", "color": "#a64cb8", "reference": "52a008e7-3976-4c16-8caf-f37c9670efe9"}, {"id": "player-host-161", "displayName": "adasdadasd", "type": "label", "color": "#a64cb8", "reference": "host"}, {"id": "player-label-162", "displayName": "Du bist drinnen! jhk", "type": "label", "color": "#a64cb8", "reference": "4f98d628-0771-4dfd-947d-0f530ee340d6"}, {
                "id": "player-host-162",
                "displayName": "jhk",
                "type": "label",
                "color": "#a64cb8",
                "reference": "host"
            }, {"id": "player-label-163", "displayName": "Du bist drinnen! dsf", "type": "label", "color": "#a64cb8", "reference": "ae243c5a-6b61-4ddd-9b26-2411a571ad00"}, {"id": "player-host-163", "displayName": "dsf", "type": "label", "color": "#a64cb8", "reference": "host"}, {"id": "player-label-164", "displayName": "Du bist drinnen! adasd", "type": "label", "color": "#a64cb8", "reference": "f0e379c3-9256-4332-9ba8-12a896ba8df4"}, {"id": "player-host-164", "displayName": "adasd", "type": "label", "color": "#a64cb8", "reference": "host"}, {"id": "player-label-165", "displayName": "Du bist drinnen! adsdasd", "type": "label", "color": "#a64cb8", "reference": "a8fffd2e-ad87-46e9-b5cd-478eaba5fe07"}, {"id": "player-host-165", "displayName": "adsdasd", "type": "label", "color": "#a64cb8", "reference": "host"}, {
                "id": "player-label-166",
                "displayName": "Du bist drinnen! sadasda",
                "type": "label",
                "color": "#a64cb8",
                "reference": "573fe978-a7ba-48c6-891b-882803609726"
            }, {"id": "player-host-166", "displayName": "sadasda", "type": "label", "color": "#a64cb8", "reference": "host"}, {"id": "player-label-167", "displayName": "Du bist drinnen! 4456546546546", "type": "label", "color": "#a64cb8", "reference": "c16489d3-02d3-414c-ae25-f9b1391e00d4"}, {"id": "player-host-167", "displayName": "4456546546546", "type": "label", "color": "#a64cb8", "reference": "host"}, {"id": "player-label-168", "displayName": "Du bist drinnen! 55555", "type": "label", "color": "#a64cb8", "reference": "2bc89f61-a648-44bf-a4f7-a9b33214c436"}, {"id": "player-host-168", "displayName": "55555", "type": "label", "color": "#a64cb8", "reference": "host"}, {"id": "player-label-202", "displayName": "Du bist drinnen! ad", "type": "label", "color": "#a64cb8", "reference": "3f8d867e-9664-42bc-8498-0e5505f2af5a"}, {"id": "player-host-202", "displayName": "ad", "type": "label", "color": "#a64cb8", "reference": "host"}, {
                "id": "player-label-203",
                "displayName": "Du bist drinnen! Test",
                "type": "label",
                "color": "#a64cb8",
                "reference": "e7345a1e-3861-4552-8a03-18acdc712ce3"
            }, {"id": "player-host-203", "displayName": "Test", "type": "label", "color": "#a64cb8", "reference": "host"}, {"id": "player-label-204", "displayName": "Du bist drinnen! 1", "type": "label", "color": "#a64cb8", "reference": "c8eb00bd-fdea-4385-b2ac-72168da2ebc8"}, {"id": "player-host-204", "displayName": "1", "type": "label", "color": "#a64cb8", "reference": "host"}, {"id": "player-label-159", "displayName": "Du bist drinnen! 556", "type": "label", "color": "#a64cb8", "reference": "6deb8b64-5210-4fe1-8a7e-70d212debc68"}, {"id": "player-host-159", "displayName": "556", "type": "label", "color": "#a64cb8", "reference": "host"}],
            "hasStarted": true,
            "questionSet": {"id": 0, "name": "ahfdygag sadfsafasfda asdad", "sound": false, "questions": []},
            "hasEnded": false,
            "questionNumber": 0
        };
    }
}
