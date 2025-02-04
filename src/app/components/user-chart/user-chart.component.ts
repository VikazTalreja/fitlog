import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-user-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './user-chart.component.html',
  styleUrls: ['./user-chart.component.css'],
})
export class UserChartComponent implements OnInit {
  @Input() user: any; 

  basicData: any; // Chart data
  basicOptions: any; // Chart options

  ngOnInit() {
    if (this.user) {
      // Chart data
      this.basicData = {
        labels: this.user.workouts.map((workout: any) => workout.type), // Workout types
        datasets: [
          {
            label: 'Workout Minutes',
            data: this.user.workouts.map((workout: any) => workout.minutes), // Workout minutes
            // backgroundColor: ['#42A5F5', '#66BB6A', '#FF9800'], // Bar colors
            //backgroundColor: 'rgba(59, 130, 246, 0.8)',  Tailwind bg-blue-500 equivalent
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',  // Tailwind bg-blue-500
              'rgba(37, 99, 235, 0.8)',   // Tailwind bg-blue-600
              'rgba(29, 78, 216, 0.8)',   // Tailwind bg-blue-700
              'rgba(23, 63, 172, 0.8)',   // Tailwind bg-blue-800
              'rgba(17, 49, 135, 0.8)'    // Tailwind bg-blue-900
            ],
            borderColor: 'rgba(37, 99, 235, 1)', // Tailwind bg-blue-600 equivalent
            borderWidth: 2,
            hoverBackgroundColor: 'rgba(37, 99, 235, 1)', // Tailwind bg-blue-600 equivalent
            hoverBorderColor: 'rgba(29, 78, 216, 1)', // Tailwind bg-blue-700 equivalent

          },
        ],
      };
      this.basicOptions={
        plugins: {
          datalabels: {
            color: '#ffffff', // White text inside bars
            anchor: 'end', // Position at the end of the bar
            align: 'top', // Align inside the bar
            font: {
              size: 14,
              weight: 'bold',
            },
          },
        }
      }
    }
  }
}
