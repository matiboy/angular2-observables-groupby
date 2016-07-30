import { Injectable } from '@angular/core';
import * as lodash from 'lodash';
import {Subject} from 'rxjs/Rx';

const people = ['Audry', 'Jose', 'Mat']

export interface MessageInterface {
  who: string;
  score: number;
}

@Injectable()
export class MockScoreService {
  socketMessage$ = new Subject<MessageInterface>();

  constructor() {
    this.socketMessage$.subscribe(m => console.log(`Sent by ${m.who}: ${m.score}`));
    this.randomMessage();
  }

  // Faking a socket or similar
  randomMessage() {
    setTimeout(() => {
      let randomPerson = lodash.sample(people);
      //  Sends a random message with a score and the name of who submitted their score
      this.socketMessage$.next({
        who: randomPerson,
        score: lodash.random(100, 10000)
      });
      this.randomMessage();
      // At a random interval between 1 and 3.5 seconds
    }, lodash.random(1000, 3500));
  };

}
