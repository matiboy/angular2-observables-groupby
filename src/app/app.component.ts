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
  constructor(scoreService:MockScoreService) {
    let playerScores$ = scoreService.socketMessage$.groupBy(m => m.who, m => m.score);
    let players$ = new BehaviorSubject<PlayerInterface[]>([]);
    let singlePlayers$ = playerScores$.map(player => {
      let score$ = new BehaviorSubject(0);
      player.scan((best, latest) => Math.max(best, latest), 0)
        .distinctUntilChanged()
        .subscribe(score$);
      return {
        name: player.key,
        score$: score$
      };
    });
    singlePlayers$.scan((ov, player) => [...ov, player], [])
    .subscribe(players$);
    this.players$ = singlePlayers$
      .map(player => player.score$.skip(1)) // Skip first assignment (0 from BehaviourSubject)
      .mergeAll()
      .map(_ => lodash.sortBy(players$.getValue(), player => -1 * player.score$.getValue()));
  }
}
