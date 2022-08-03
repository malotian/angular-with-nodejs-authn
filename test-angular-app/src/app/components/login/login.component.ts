import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'redirect',
  template: 'redirecting...',
})
export class LoginComponent implements OnInit {
  relayState: any;
  constructor(public router: Router) {
    this.relayState = history.state.relayState;
  }
  state$!: Observable<object>;

  ngOnInit() {
    console.log('extras: ' + JSON.stringify(this.relayState));
    window.location.href =
      '/authn-handler?RelayState=' + encodeURIComponent(this.relayState);
  }
}
