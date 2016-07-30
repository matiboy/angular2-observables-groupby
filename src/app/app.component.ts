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
    // Group by will emit a new GroupedObservable every time the key is new
    // The key is determined by the first callback, here "who" sent the score
    // The second callback is what the GroupedObservable will emit, namely the score
    let playerScores$ = scoreService.socketMessage$.groupBy(m => m.who, m => m.score);
    let players$ = new BehaviorSubject<PlayerInterface[]>([]);
    // Let's transform the grouped observable into a "Player" object that fulfills the PlayerInterface
    playerScores$.map(player => {
      // We will need to read the current value (for ordering purposes) so let's use a BehaviorSubject
      // BehaviorSubjects have a synchronous .getValue method
      // They need to be instantiated with a start value though, let's use 0
      let score$ = new BehaviorSubject(0);
      // Reduce the work of the final subscribers, let's only emit if we have a new personal best
      let newHighScore$ = player 
        .scan((best, latest) => Math.max(best, latest), 0)
        // If, from the scan, we reemit the same value (if the new score isn't higher),
        // distinctUntilChanged (without compare method) will drop the emission
        .distinctUntilChanged()
      // Now transmit the emissions from newHighScore$ to that of score$ which will be on the PlayerInterface (and hence on the player component)
      newHighScore$.subscribe(score$);
      // Also emit at the component-wide level to let the component know that a player has a new personal best
      // This will trigger the re-ordering (and adding to the list if new player)
      // We're not interested in knowing the actual score though, hence the map to null
      newHighScore$.map(_ => null).subscribe(this.newPlayerHighScore$);
      return {
        name: player.key,
        score$: score$
      };
    }).scan((ov, newPlayer) => {
      // Although we could afford to use a mutation (.push) because this observable is only subscribed to once,
      // let's stick to a non-mutating operation, using the cute spread operator notation
      return [...ov, newPlayer];
    }, []).subscribe(players$);
    // We'll want to review the list of players any time a personal best is set
    // This works when new players are added, as well as a way to check whether we need to reorder
    this.players$ = this.newPlayerHighScore$
      // sort the players by their high score descending (*-1) 
      .map(_ => lodash.sortBy(players$.getValue(), player => -1 * player.score$.getValue()))
      // Compare the two arrays of previous vs new order (by name)
      // If compare method returns true, distinctUntilChanged doesn't emit
      .distinctUntilChanged((ov, nv) => lodash.isEqual(lodash.map(ov, 'name'), lodash.map(nv, 'name')))
  }
}
