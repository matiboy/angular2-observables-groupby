import { Component, Input } from '@angular/core';
import {PlayerInterface} from './player.interface';

@Component({
  selector: '[player]',
  template: `
      <td>{{player.name}}</td>
      <td>{{player.score$ | async}}</td>
  `
})
export class PlayerComponent {
  @Input() player:PlayerInterface;
  constructor() { }
}
