import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'], 
  standalone: true,
})
export class HeaderComponent implements OnInit {
  greeting: string = '';

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.userDataService.switchToSampleData();
  }

}
