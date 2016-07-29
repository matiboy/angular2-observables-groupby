import { Component } from '@angular/core';
import {MockScoreService} from './mock-score.service';
import {Observable, Subject, BehaviorSubject} from 'rxjs/Rx';
import {PlayerComponent, PlayerInterface} from './player';
import * as lodash from 'lodash';


@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [MockScoreService],
  directives: [PlayerComponent]
})
export class AppComponent {
  players$: Observable<PlayerInterface[]>;
  newPlayerHighScore$ = new Subject<void>();  
  constructor(scoreService:MockScoreService) {
  }
}
