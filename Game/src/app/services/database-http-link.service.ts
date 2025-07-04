import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Game } from "../models/DTOs";
import { Player } from "../models/DTOs";
import { Question, QuestionSet } from "../models/DTOs";

@Injectable({
  providedIn: 'root'
})
export class DatabaseHttpLinkService {

  constructor(private http: HttpClient) { }

  private gameUrl = "http://192.168.0.6:20080/api/game";
  private playerUrl = "http://192.168.0.6:20080/api/players";
  private questionUrl = "http://192.168.0.6:20080/api/questions";

  // === Game endpoints ===

  createGame(): Observable<Game> {
    return this.http.post<Game>(`${this.gameUrl}`, {});
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.gameUrl}/${id}`);
  }

  addPlayerToGame(gameId: number, playerId: number): Observable<Game> {
    return this.http.put<Game>(`${this.gameUrl}/${gameId}/${playerId}`, {});
  }

  updateTouchComponents(id: number, touchComponents: string): Observable<Game> {
    return this.http.put<Game>(`${this.gameUrl}/${id}`, touchComponents, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  modifyGame(id: number, patchData: Partial<Game>): Observable<Game> {
    return this.http.patch<Game>(`${this.gameUrl}/${id}`, patchData);
  }

  getTouchComponents(id: number): Observable<any> {
    return this.http.get<any>(`${this.gameUrl}/touchComponents/${id}`);
  }

  // === Player endpoints ===

  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.playerUrl}`);
  }

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.playerUrl}/${id}`);
  }

  // === Question endpoints ===

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.questionUrl}`);
  }

  getQuestion(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.questionUrl}/${id}`);
  }

  getQuestionSet(id: number): Observable<QuestionSet> {
    return this.http.get<QuestionSet>(`${this.questionUrl}/set/${id}`);
  }

  getAllQuestionSet(): Observable<QuestionSet[]> {
    return this.http.get<QuestionSet[]>(`${this.questionUrl}/set`);
  }
}
