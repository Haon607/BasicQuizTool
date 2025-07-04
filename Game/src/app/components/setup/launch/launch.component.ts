import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { QuestionSet } from "../../../models/DTOs";
import { DatabaseHttpLinkService } from "../../../services/database-http-link.service";
import { MemoryService } from "../../../services/memory.service";

@Component({
  selector: 'app-launch.game',
  standalone: true,
  imports: [],
  templateUrl: './launch.component.html',
  styleUrl: './launch.component.css'
})
export class LaunchComponent {
  sets: QuestionSet[] = [];
  constructor(private router: Router, private db: DatabaseHttpLinkService, private memory: MemoryService) {
    this.db.getAllQuestionSet().subscribe(sets => this.sets = sets);
  }

  launch(set: QuestionSet) {
    this.memory.questionSet = set;
    this.router.navigateByUrl('/join');
  }
}
