import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TeamViewModel} from '../_models/team_viewmodel';
import {TeamService} from '../_services/team.service';
import {Chart} from 'chart.js';
import {MatDialog} from '@angular/material';
import {RecommendationModalComponent} from '../_modals/recommendation-modal/recommendation-modal.component';
import {TryoutModalComponent} from "../_modals/tryout-modal/tryout-modal.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-team-profile',
  templateUrl: './team-profile.component.html',
  styleUrls: ['./team-profile.component.css']
})
export class TeamProfileComponent implements OnInit, AfterViewInit {

  viewModel: TeamViewModel;
  mockAuthor;
  chart = [];
  data = {};
  options = {};
  id;
  constructor(private teamService : TeamService, private route: ActivatedRoute, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.id  = this.route.snapshot.paramMap.get('id');
    this.mockAuthor = {
      name: 'Sports Connected',
      id: '-1',
      avatar: '/assets/default-profile.png',
      team: {
        id: '-1',
        acronym: 'SCT',
        avatar: '/assets/SP_Logo_Black.png',
        name: 'Sports Connected Team',
      }
    }

  }

  ngAfterViewInit() {
    this.teamService.getTeam(this.id)
      .subscribe(team => this.viewModel = team);
  }

  loadChart() {
    this.data = {
      labels: ['Ataque', 'Tática', 'Defesa', 'Meio Campo', 'Bolas paradas'],
      datasets: [{
        data: [19, 18, 14, 15, 23]
      }]
    };
    this.options = {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          ticks: {
            mirror: true
          },
          gridLines: {
            display: false
          }
        }]
      }
    };
    this.chart = new Chart('radar', {
      type: 'horizontalBar',
      data: this.data,
      options: this.options
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(RecommendationModalComponent,
      {
        data: {
          target: this.viewModel,
          author: this.mockAuthor,
          edit: false,
          create: true
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.teamService.createRecommendation('0', result).subscribe()
        {
          // Todo: Add to the real team recommendation's list instead of the top 5
          this.viewModel.recommendations.top_5.push(result);
          //this.recommendationDataSource.filter = this.filterString;
        }
      }
    });
  }

  openTryoutDialog(): void {
    const dialogRef = this.dialog.open(TryoutModalComponent,
      {
        data: {
          target: this.viewModel,
          author: this.mockAuthor,
          edit: false,
          create: true
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        //this.teamService.createRecommendation('0',result).subscribe()
        {
          // Todo: Add to the real team recommendation's list instead of the top 5
          this.viewModel.tryouts.push(result);
          //this.recommendationDataSource.filter = this.filterString;
        }
      }
    });
  }

  openRecommendationsDialog(): void {
  }

}
