import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InternshipService } from '../../services/internship.service';
import { Internship, ApplicationStatus, WorkMode, CompanySize } from '../../models/internship.model';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.page.html',
  styleUrls: ['./internships.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class InternshipsPage implements OnInit {
  internships: Internship[] = [];
  filteredInternships: Internship[] = [];

  filtersOpen = false;
  
  searchTerm = '';
  filterStatus: ApplicationStatus | '' = '';
  filterTechnology = '';
  filterWorkMode: WorkMode | '' = '';
  filterIndustry = '';
  filterCompanySize: CompanySize | '' = '';

  constructor(
    private internshipService: InternshipService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadInternships();
  }

  async loadInternships() {
    this.internships = await this.internshipService.getAll();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredInternships = this.internships.filter(internship => {
      const matchesSearch = !this.searchTerm || 
        internship.company_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        internship.position.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.filterStatus || internship.status === this.filterStatus;
      
      const matchesTechnology = !this.filterTechnology || 
        (internship.tech_stack && 
         internship.tech_stack.toLowerCase().includes(this.filterTechnology.toLowerCase()));
      
      const matchesWorkMode = !this.filterWorkMode || internship.work_mode === this.filterWorkMode;
      const matchesIndustry = !this.filterIndustry || internship.industry === this.filterIndustry;
      const matchesCompanySize = !this.filterCompanySize || internship.company_size === this.filterCompanySize;

      return matchesSearch &&
             matchesStatus &&
             matchesTechnology &&
             matchesWorkMode &&
             matchesIndustry &&
             matchesCompanySize;
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value || '';
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  viewDetails(internship: Internship) {
    this.router.navigate(['/tabs/internship-details', internship.id]);
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