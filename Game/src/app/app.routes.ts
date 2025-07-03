import { Routes } from '@angular/router';
import { LaunchComponent } from "./components/setup/launch/launch.component";
import { JoinComponent } from "./components/setup/join/join.component";

export const routes: Routes = [
    {path: '', component: LaunchComponent},
    {path: 'join', component: JoinComponent}
];
