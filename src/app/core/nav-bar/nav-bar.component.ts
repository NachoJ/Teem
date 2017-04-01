import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'te-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  navLinks: any;
  constructor(private router: Router) {

    this.navLinks = [
      {
        title: "HOME",
        link: "/home"
      },
      {
        title: "FIND MATCH",
        link: "/find-match"
      },
      {
        title: "TOURNMENTS",
        link: "/tournaments"
      },
      {
        title: "My Sports Center",
        link: "/my-sportscenter"
      },
    ];

  }

  ngOnInit() {
  }

  logout() {
	  console.log('logout clicked');
	//   window.localStorage['teem_user'] = '';
	  window.localStorage.removeItem['teem_user'];
	  window.localStorage.clear();
	  this.router.navigate(['/auth']);
  }
}
