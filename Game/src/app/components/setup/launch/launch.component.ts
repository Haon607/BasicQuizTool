import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { QuestionSet } from "../../../models/DTOs";
import { DatabaseHttpLink } from "../../../services/database-http-link";
import { Memory } from "../../../services/memory";

@Component({
  selector: 'app-launch.game',
  standalone: true,
  imports: [],
  templateUrl: './launch.component.html',
  styleUrl: './launch.component.css'
})
export class LaunchComponent {
  sets: QuestionSet[] = [];
  constructor(private router: Router, private db: DatabaseHttpLink, private memory: Memory) {
    this.db.getAllQuestionSet().subscribe(sets => this.sets = sets);
  }

  launch(set: QuestionSet) {
    this.memory.questionSet = set;
    this.router.navigateByUrl('/join');
  }
}
