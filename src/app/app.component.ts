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
    let players$ = new BehaviorSubject<PlayerInterface[]>([]);
    playerScores$.map(player => {
      let score$ = new BehaviorSubject(0);
      let newHighScore$ = player
        .scan((best, latest) => Math.max(best, latest), 0)
        .distinctUntilChanged();
      newHighScore$.subscribe(score$);
      newHighScore$.map(_ => null).subscribe(this.newPlayerHighScore$);
      return {
        name: player.key,
        score$: score$
      };
    })
    .scan((ov, player) => [...ov, player], [])
    .subscribe(players$);
    this.players$ = this.newPlayerHighScore$.map(_ => lodash.sortBy(players$.getValue(), player => -1 * player.score$.getValue()));
  }
}
