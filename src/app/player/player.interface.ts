import {BehaviorSubject} from 'rxjs/Rx';

export interface PlayerInterface {
    name:string;
    score$: BehaviorSubject<number>;
}