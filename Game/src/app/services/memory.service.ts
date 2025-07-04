import { Injectable } from '@angular/core';
import { Game, QuestionSet } from "../models/DTOs";

@Injectable({
  providedIn: 'root'
})
export class MemoryService {
  questionSet?: QuestionSet;
  game?: Game;

  constructor() { }
}
