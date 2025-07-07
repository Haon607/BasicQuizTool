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

@Component({
  selector: 'app-question.component',
  imports: [
    InfoCardComponent,
    TimerComponent
  ],
  templateUrl: './question.component.html',
  standalone: true,
  styleUrl: './question.component.css'
})
export class QuestionComponent {
  protected game: Game;
  private destroy$: Subject<void> = new Subject<void>();
  private deviceHandler: QuestionDevice;
  @ViewChild(TimerComponent) timer!: TimerComponent;

  constructor(
      private memory: MemoryService,
      private db: DatabaseHttpLinkService,
      private device: DeviceService,
      private router: Router
  ) {
    this.deviceHandler = new QuestionDevice(device);
    this.game = memory.game!;
    this.device.incomingTouchComponents.pipe(takeUntil(this.destroy$)).subscribe(components => {
      this.deviceHandler.handleTabletInput(components, ()=>{});
    });
    db.getGame(memory.game!.id).subscribe(game => {
      this.game = game;
      this.memory.game = game;
      this.deviceHandler.sendUiState(game.players, game);
    });
    this.setupPage();
  }

  private async setupPage() {
    await wait(100)
    this.timer.setupTimer()
    await wait(5000)
    this.timer.startTimer()
  }
}
