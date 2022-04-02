import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  constructor() { }
  stocks = ['dax', 'ftse', 'sp500'];
  crypto = ['btcusd', 'ethusd'];
  commodities = ['goldusd', 'oilusd'];
  currencies = ['eurpln', 'usdpln']

  ngOnInit(): void {
  }

}
