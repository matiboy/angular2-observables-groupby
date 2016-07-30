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
    let playerScores$ = scoreService.socketMessage$.groupBy(m => m.who, m => m.score);
    this.players$ = playerScores$.map(player => {
      let score$ = new BehaviorSubject(0);
      player
        .scan((best, latest) => Math.max(best, latest), 0)
        .subscribe(score$);
      return {
        name: player.key,
        score$: score$
      };
    }).scan((ov, player) => [...ov, player], []);

  }
}
