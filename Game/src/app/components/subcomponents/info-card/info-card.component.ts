import { Component, Input } from '@angular/core';
import { Game } from "../../../models/DTOs";

@Component({
  selector: 'app-info-card',
  imports: [],
  templateUrl: './info-card.component.html',
  standalone: true,
  styleUrl: './info-card.component.css'
})
export class InfoCardComponent {
  @Input() game!: Game;


}
