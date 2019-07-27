import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileTabComponent } from '../profile-tab.component';
import { ProfileService } from './../../profile.service';
import { AddPracticeAreaData, PracticeArea } from './practice-area.interface';

@Component({
  selector: 'app-add-practice-area-dialog',
  templateUrl: './add-practice-area-dialog.component.html',
  styleUrls: ['./add-practice-area-dialog.component.scss']
})
export class AddPracticeAreaDialogComponent extends ProfileTabComponent implements OnInit {
  practiceAreas: string[] = [
    "Administrative",
    "Admiralty & Maritime",
    "Adoption",
    "Advertising",
    "Agriculture",
    "Alimony",
    "Animal",
    "Animal & Dog Bites",
    "Antitrust",
    //"Antitrust & Trade Law",
    "Appeals",
    "Arbitration",
    "Asylum",
    "Aviation",
    "Bankruptcy",
    "Bankruptcy & Debt",
    "Birth Injury",
    "Brain Injury",
    "Business",
    "Car Accidents",
    "Chapter 11 Bankruptcy",
    "Chapter 13 Bankruptcy",
    "Chapter 7 Bankruptcy",
    "Child Abuse",
    "Child Custody",
    "Child Support",
    "Childrens", // Law/Juvenile Justice
    "Civil Rights", // /Civil Liberties // "Human Rights",
    "Class Action",
    "Commercial",
    "Communications & Media",
    "Computer Fraud",
    "Constitutional",
    "Construction & Development",
    "Consumer Protection",
    "Contracts & Agreements",
    "Copyright Application",
    "Copyright Infringement",
    "Corporate & Incorporation",
    "Credit Card Fraud",
    "Credit Repair",
    "Criminal",
    "Criminal Defense",
    "Cryptography",
    "Cultural Property",
    "Defamation",
    "DUI & DWI",
    "Debt & Lending Agreements",
    "Debt Collection",
    "Debt Settlement",
    "Defective and Dangerous Products",
    "Discrimination",
    "Divorce & Separation",
    "Domestic Violence",
    "Education",
    "Elder Law",
    "Election Campaigns & Political Law",
    "Employee Benefits",
    "Employment & Labor",
    "Energy & Utilities",
    "Entertainment",
    "Entertainment", // Media
    "Environmental and Natural Resources",
    "Environmental",
    "Equipment Finance and Leasing",
    "Estate Planning",
    "Ethics & Professional Responsibility",
    "Expungement",
    "Family", // "Divorce", Domestic Partner,
    "Federal Crime",
    "Federal Regulation",
    "Financial Markets and Services",
    "Foreclosure",
    "Franchising",
    "Gaming",
    "General Practice",
    "Government Contracts",
    "Government",
    "Guardianship",
    "Health Care",
    "Health Insurance",
    "Health",
    "Identity Theft",
    "Immigration", // Law, Student Visa, "Citizenship", "Visa Extension"
    "Insurance Fraud",
    "Insurance",
    "Intellectual Property", // Patent, Copyrights, TradeSecrets
    "International Development",
    "International Law",
    "International Trade",
    "Internet",
    "Juvenile",
    "Labor", // Employment
    "Land Use & Zoning",
    "Landlord & Tenant",
    "Lawsuits & Disputes",
    "Lemon Law",
    "LGBT",
    "Libel & Slander",
    "Licensing",
    "Life Insurance",
    "Life Sciences & Biotechnology",
    "Limited Liability Company (LLC)",
    "Litigation",
    "Marriage & Prenuptials",
    "Mediation",
    "Medicaid & Medicare",
    "Medical Malpractice",
    "Mergers & Acquisitions",
    "Mesothelioma & Asbestos",
    "Military Law",
    "Motorcycle Accident",
    "Native Peoples Law",
    "Nursing Home Abuse and Neglect",
    "Oil & Gas",
    "Partnership",
    "Patent Application",
    "Patent Infringement",
    "Personal Injury",
    "Power Of Attorney",
    "Prisoner",
    "Privacy",
    "Probate",
    "Project Finance",
    "Public Finance & Tax Exempt Finance",
    "Real Estate", // "Land use & zoning", "Housing", //Law/Community Economic Development
    "Residential",
    "Securities & Investment Fraud",
    "Securities Offerings",
    "Securities",
    "Sex Crime",
    "Sexual Harassment",
    "Slip and Fall Accident",
    "Social Security",
    "Speeding & Traffic Ticket",
    "Spinal Cord Injury",
    "Sports",
    "State, Local And Municipal Law",
    "Tax Fraud & Tax Evasion",
    "Tax",
    "Telecommunications",
    "Trademark Application",
    "Trademark Infringement",
    "Traffic Matters", // DUI, Speeding Ticket, Parking Ticket, Car Accident
    "Transportation",
    "Trucking Accident",
    "Trusts and Estates", // "Wills" "Estate Planning"
    "Uncontested Divorce",
    "Venture Capital",
    "Violent Crime",
    "White Collar Crime",
    "Wills & Living Wills",
    "Women's Rights",
    "Workers Compensation",
    "Wrongful Death",
    "Wrongful Termination"
  ];

  addPracticeAreaForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddPracticeAreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddPracticeAreaData,
    protected profileService: ProfileService
  ) {
    super(profileService);
  }

  onInit() {
    this.addPracticeAreaForm = new FormGroup({
      title: new FormControl(this.data.element.title, Validators.required),
      relative_percentage: new FormControl(this.data.element.relative_percentage, Validators.required)
    });
  }

  form() {
    return this.addPracticeAreaForm;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
