import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { InternshipService } from '../../services/internship.service';
import { Internship, InternshipStats, ApplicationStatus } from '../../models/internship.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HomePage implements OnInit {
  stats: InternshipStats = {
    total: 0,
    notApplied: 0,
    applied: 0,
    offers: 0,
    rejected: 0
  };

  recentInternships: Internship[] = [];

  constructor(
    private internshipService: InternshipService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.stats = await this.internshipService.getStats();
    const all = await this.internshipService.getAll();
    this.recentInternships = all.slice(0, 5);
  }

  getStatusColor(status: ApplicationStatus): string {
    switch (status) {
      case 'not_applied': return 'medium';
      case 'applied': return 'primary';
      case 'offer': return 'success';
      case 'rejected': return 'danger';
    }
  }

  getStatusLabel(status: ApplicationStatus): string {
    switch (status) {
      case 'not_applied': return 'Not Applied';
      case 'applied': return 'Applied';
      case 'offer': return 'Offer';
      case 'rejected': return 'Rejected';
    }
  }

  viewDetails(internship: Internship) {
    this.router.navigate(['/tabs/internship-details', internship.id]);
  }
}