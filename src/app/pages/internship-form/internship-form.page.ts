import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from '../../services/internship.service';
import { Internship, ApplicationMethod, WorkMode, CompanySize, ApplicationStatus } from '../../models/internship.model';

@Component({
  selector: 'app-internship-form',
  templateUrl: './internship-form.page.html',
  styleUrls: ['./internship-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class InternshipFormPage implements OnInit {
  isEditMode = false;
  internshipId: string = '';
  
  internship: Internship = {
    company_name: '',
    industry: 'Technology',
    company_size: 'startup',
    position: '',
    tech_stack: '',
    country: 'Morocco',
    city: '',
    work_mode: 'onsite',
    application_date: new Date().toISOString().split('T')[0],
    application_method: 'email',
    application_reference: '',
    status: 'not_applied'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private internshipService: InternshipService
  ) {}

  async ngOnInit() {
    this.internshipId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.internshipId) {
      this.isEditMode = true;
      const data = await this.internshipService.getById(this.internshipId);
      if (data) {
        this.internship = data;
        if (this.internship.application_date) {
          const date = new Date(this.internship.application_date);
          this.internship.application_date = date.toISOString().split('T')[0];
        }
      }
    }
  }

  async onSubmit() {
    if (this.isEditMode) {
      await this.internshipService.update(this.internshipId, this.internship);
      this.router.navigate(['/tabs/internship-details', this.internshipId]);
    } else {
      const created = await this.internshipService.create(this.internship);
      if (created) {
        this.router.navigate(['/tabs/internships']);
      }
    }
  }

  cancel() {
    if (this.isEditMode) {
      this.router.navigate(['/tabs/internship-details', this.internshipId]);
    } else {
      this.router.navigate(['/tabs/internships']);
    }
  }
}