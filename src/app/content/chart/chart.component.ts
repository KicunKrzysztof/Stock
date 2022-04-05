import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from "angular-google-charts";
import { HttpCollectionsService } from 'src/app/http-collections.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  constructor(private httpCollectionsService:HttpCollectionsService,
    private responsive: BreakpointObserver) { }
  lastValue:number = 0;
  type: ChartType = ChartType.LineChart;
  data:any;
  options = {
    titleTextStyle: {
      color: '#fff'
  },
  hAxis: {
      textStyle: {
          color: '#fff',
          opacity: .6
      },
      titleTextStyle: {
          color: '#fff',
          opacity: .6
      },
      slantedText: true
  },
  vAxis: {
      textStyle: {
          color: '#fff',
          opacity: .6
      },
      titleTextStyle: {
          color: '#fff',
          opacity: .6
      }
  },

    chartArea: { backgroundColor: 'black' },
    backgroundColor: '#303030',
    colors: ['#9c27b0'],
    legend: {position: 'none'},
    pointSize: 1,
    enableInteractivity: true,
    explorer: {
      maxZoomOut:2,
      maxZoomIn: 8,
      keepInBounds: true
  }};
  cols = [
    {label: 'Time', id: 'Time', type: 'date'},
    {label: 'Value', id: 'Value', type: 'number'}
  ];
  width = 1200;
  height = 400;
  small_device:boolean = false;
  @Input() asset: string;
  ngOnInit(): void {
    this.responsive.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium])
      .subscribe(result => {
        const breakpoints = result.breakpoints;
        this.width = 1200
        this.small_device = false;
        if (breakpoints[Breakpoints.XSmall]) {
          this.width = 400;
          this.small_device = true;
        }
        else if (breakpoints[Breakpoints.Small]) {
          this.width = 550;
          this.small_device = true;
        }
        else if (breakpoints[Breakpoints.Medium]) {
          this.width = 900;
          this.small_device = true;
        }
    
      });
    this.reload(30);
  }
  reload(days:number):void{
    let from = new Date();
    from = new Date((new Date()).getTime() - (1000 * 60 * 60 * 24 * days));
    this.httpCollectionsService.getCollection(this.asset, from.toISOString()).subscribe(
      (data:string[]) => {
        if (data != null ) this.lastValue = parseFloat(data[0][1]);
        this.data = [];
        data.forEach(element => {
          let date = new Date(element[0]);
          this.data.push([
            date,
            element[1]
          ])
        });
      }
    )
  }
}
