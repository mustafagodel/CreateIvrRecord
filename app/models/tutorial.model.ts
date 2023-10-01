export class Tutorial {

  ivrAdi?: string;
  ivrKodu?: string;
  duyuru?: string;
  zamanAsimiSuresi?: number;
  zamanAsimiSesKaydi?: string;
  zamanAsimiTekrarSayisi?: number;
  hataliGirisSesKaydi?: string;
  hataliGirisTekrarSayisi?: number;
    ivrTuslama?: number;
    ivrHedefTipi?: string;
    hedef?: number;
}


const tutorial = new Tutorial();
tutorial.ivrTuslama = 1;
tutorial.ivrHedefTipi = "Queue";
tutorial.hedef = 100;

// Tutorial nesnesini bir diziye dönüştürme
const tutorialDizisi = [
  {
    ivrTuslama: tutorial.ivrTuslama,
    ivrHedefTipi: tutorial.ivrHedefTipi,
    hedef: tutorial.hedef
  }
];
