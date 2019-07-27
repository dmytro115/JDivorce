import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: [
    './aboutus.component.scss'
  ]
})

export class AboutUsComponent implements OnInit {
  BoardOfAdvisors = [{
    id: "1",
    name: "Dan Lear",
    image: "assets/images/advisors/advisor-dan-lear.png",
    bio: "Dan Lear is a lawyer and legal technology industry innovator. He led industry relations for Avvo, one of the top legal technology success stories. Dan runs his own legal technology consulting practice, Right Brain Law."
  }, {
    id: "2",
    name: "Deirdre Bowen",
    image: "assets/images/advisors/advisor-deirdre-bowen.png",
    bio: "Dr. Deirdre Bowen is an associate professor at Seattle Univeristy School of Law, and Director at the Madrid Study Abroad Program in Law & Policy. She's a nationally recognized expert in affirmative action, nontraditional families, and the legal system."
  }, {
    id: "3",
    name: "Aurora Martin",
    image: "assets/images/advisors/advisor-aurora-martin.jpeg",
    bio: "Aurora has served 20+ years in Washington legal aid as a public interest lawyer and later as an Executive Director at Columbia Legal Services. Aurora is the founder of popUPjustice and advises several social impact startups. She's recognized as an emerging innovator in the ABA 2018 Women in LegalTech."
  }, {
    id: "4",
    name: "Jody Cloutier",
    image: "assets/images/advisors/advisor-jody-cloutier.jpeg",
    bio: "Jody was a senior manager at Microsoft and then pursued a career in family law. Jody is a frequent speaker on family law topics at Seattle University School of Law, and he is also a member of the Washington State Bar Association Court Rules Committee."
  }, {
    id: "5",
    name: "Jennifer Ortega",
    image: "assets/images/advisors/advisor-jennifer-ortega.png",
    bio: "Jennifer is a strong, vocal advocate for low and moderate income clients. She is co-founder and partner at Legal Technician Division, PLLC, where she practices family law in the greater Seattle area."
  }];
  showBio: object = {};

  constructor(private router: Router) { }

  ngOnInit() { }

  toggleBio(id) {
    const currentBio = this.showBio[id];
    this.showBio[id] = !currentBio;
  }
}
