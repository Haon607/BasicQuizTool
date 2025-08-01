import { Routes } from '@angular/router';
import { LaunchComponent } from "./components/setup/launch/launch.component";
import { JoinComponent } from "./components/setup/join/join.component";
import { QuestionComponent } from "./components/gameplay/question/question.component";
import { IntroComponent } from "./components/gameplay/intro/intro.component";
import { DummyComponent } from "./components/gameplay/dummy/dummy.component";
import { ScoreboardComponent } from "./components/subcomponents/scoreboard/scoreboard.component";

export const routes: Routes = [
    {path: '', component: LaunchComponent},
    {path: 'join/:setId', component: JoinComponent},
    {path: 'intro', component: IntroComponent},
    {path: 'question/:gameid', component: QuestionComponent},
    {path: 'dummy', component: DummyComponent},
    {path: 'scoreboard/:gameid', component: ScoreboardComponent},
];
