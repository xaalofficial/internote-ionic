import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from '../../services/internship.service';
import { Internship, ApplicationStatus } from '../../models/internship.model';

@Component({
  selector: 'app-internship-details',
  templateUrl: './internship-details.page.html',
  styleUrls: ['./internship-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class InternshipDetailsPage implements OnInit {
  internship: Internship | null = null;
  internshipId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private internshipService: InternshipService
  ) {}

  async ngOnInit() {
    this.internshipId = this.route.snapshot.paramMap.get('id') || '';
    await this.loadInternship();
  }

  async loadInternship() {
    if (this.internshipId) {
      this.internship = await this.internshipService.getById(this.internshipId);
    }
  }

  editInternship() {
    this.router.navigate(['/tabs/internship-form', this.internshipId]);
  }

  goBack() {
    this.location.back();
  }

  async deleteInternship() {
      const success = await this.internshipService.delete(this.internshipId);
      if (success) {
        this.router.navigate(['/tabs/internships']);
      }
  }

  async onResumeFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      await this.internshipService.uploadResume(this.internshipId, file);
      await this.loadInternship();
    }
  }

  async onMotivationFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      await this.internshipService.uploadMotivationLetter(this.internshipId, file);
      await this.loadInternship();
    }
  }

  async deleteResume() {
      await this.internshipService.deleteDocument(this.internshipId, 'resume');
      await this.loadInternship();
  }

  async deleteMotivation() {
      await this.internshipService.deleteDocument(this.internshipId, 'motivation');
      await this.loadInternship();
  }

  viewPDF(url: string) {
    window.open(url, '_blank');
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

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  }

  // NEW METHOD: Format location as "Country, City"
  formatLocation(country: string | undefined, city: string | undefined): string {
    if (country && city) {
      return `${country}, ${city}`;
    } else if (country) {
      return country;
    } else if (city) {
      return city;
    }
    return 'Not specified';
  }
}