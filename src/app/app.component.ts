import { Component } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  submitted: boolean | null;
  tutorial: Tutorial = {
        ivrAdi: '',
        ivrKodu: '',
        duyuru: '',
        zamanAsimiSuresi: 0,
        zamanAsimiSesKaydi: '',
        zamanAsimiTekrarSayisi: 0,
        hataliGirisSesKaydi: '',
        hataliGirisTekrarSayisi: 0,
        ivrTuslama: 0,
        ivrHedefTipi: '',
        hedef: 0
    };




    constructor(private tutorialService: TutorialService) {
      this.submitted = null;
    }

  saveTutorial(): void {
    if (
      !this.tutorial.ivrAdi ||
      !this.tutorial.ivrKodu ||
      !this.tutorial.duyuru ||
      this.tutorial.zamanAsimiSuresi === 0 ||
      !this.tutorial.zamanAsimiSesKaydi ||
      this.tutorial.zamanAsimiTekrarSayisi === 0 ||
      !this.tutorial.hataliGirisSesKaydi ||
      this.tutorial.hataliGirisTekrarSayisi === 0 ||
      this.ivrList.some(ivr => !ivr.ivrTuslama || !ivr.ivrHedefTipi || !ivr.hedef)
    ) {

      this.submitted = false;
      return;
    }

    const data = {
      ivrAdi: this.tutorial.ivrAdi,
      ivrKodu: this.tutorial.ivrKodu,
      duyuru: this.tutorial.duyuru,
      zamanAsimiSuresi: this.tutorial.zamanAsimiSuresi,
      zamanAsimiSesKaydi: this.tutorial.zamanAsimiSesKaydi,
      zamanAsimiTekrarSayisi: this.tutorial.zamanAsimiTekrarSayisi,
      hataliGirisSesKaydi: this.tutorial.hataliGirisSesKaydi,
      hataliGirisTekrarSayisi: this.tutorial.hataliGirisTekrarSayisi,
      ivrTuslama: this.tutorial.ivrTuslama,
      ivrHedefTipi: this.tutorial.ivrHedefTipi,
      hedef: this.tutorial.hedef,
      ivrList: this.ivrList
    };

    this.tutorialService.createTutorial(data).subscribe({
      next: (res) => {
        console.log('Response:', res);
        this.submitted = true;
      },
      error: (e) => {
        console.error('Error:', e);
        this.submitted = false;
      }
    });
  }


    ivrList: any[] = [{ ivrTuslama: '', ivrHedefTipi: '', hedef: '' }];


    addDynamicField() {
      const emptyFields = this.ivrList.some(ivr =>
        ivr.ivrTuslama === '' || ivr.ivrHedefTipi === '' || ivr.hedef === ''
      );

      if (emptyFields) {

        this.submitted = false;
        return;
      }


      this.ivrList.push({ ivrTuslama: '', ivrHedefTipi: '', hedef: '' });
    }
  removeLastIVR(): void {
    if (this.ivrList.length > 0) {
      this.ivrList.pop();
    }
  }

}



