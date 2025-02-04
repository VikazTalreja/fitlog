import { Component } from '@angular/core';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { MainComponent } from "./components/main/main.component";

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'fitlog';
  sidebarSelected: string = 'All';

  onSidebarChange(selected: string): void {
    this.sidebarSelected = selected;
  }
}
