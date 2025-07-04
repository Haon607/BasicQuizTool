import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { TouchComponent } from "../models/DTOs";
import { DatabaseHttpLinkService } from "./database-http-link.service";
import { MemoryService } from "./memory.service";

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    incomingTouchComponents: Subject<TouchComponent[]>;
    incomingEvents: Subject<{ event: string, data: string }>;
    private ws: WebSocket;

    constructor(private db: DatabaseHttpLinkService, private memory: MemoryService) {
        this.incomingTouchComponents = new Subject<TouchComponent[]>();
        this.incomingEvents = new Subject<{ event: string, data: string }>();
        this.ws = new WebSocket('ws://192.168.0.6:23000');
        this.connectToWebSocket();
    }

    sendUIState(componentList: TouchComponent[]) {
        this.db.updateTouchComponents(this.memory.game!.id, JSON.stringify(componentList)).subscribe(() => {
        });
        this.ws.send(JSON.stringify({
            event: 't_update-ui-state',
            data: componentList
        }));
    }

    sendEmptyUi() {
        this.sendUIState([]);
    }

    private connectToWebSocket(): void {
        this.ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        this.ws.onmessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            if (message.event === 't_current-ui-state') {
                this.handleUiStateChange(message.data);
            } else {
                this.incomingEvents.next(message);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }

    private handleUiStateChange(component: TouchComponent[]) {
        this.incomingTouchComponents.next(component);
    }

}
