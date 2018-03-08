import { Component, AfterViewInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {

  loader = true;
  loaderFilms = true;
  id = 0;
  data;
  films;
  filmUrl = 'https://swapi.co/api/films/';
  planets = new Object();
  species = new Object();
  initialPage = 1;

  constructor (private http: Http) {
    this.changePage(this.initialPage);
    this.getFilms(this.filmUrl);
  }

  start() {
    $('.start').addClass('started');
  }

   getPerson(page): Observable<any> {
       return this.http.get('https://swapi.co/api/people/?page=' + page + '&format=json')
       .map((res: any) => res.json());
   }

   getPlanet(planet): Observable<any> {
       return this.http.get(planet + '?format=json')
       .map((res: any) => res.json());
   }

   getSpecie(specie): Observable<any> {
       return this.http.get(specie + '?format=json')
       .map((res: any) => res.json());
   }

   getFilm(film): Observable<any> {
       return this.http.get(film + '?format=json')
       .map((res: any) => res.json());
   }

   openModal(id) {
     this.id = id;
     $('#personModal').modal('open');
   }

   changeId(id) {
     this.id = id;
   }

   getFilms(filmUrl) {
     this.loaderFilms = true;
     const filmsAsync = new Promise((resolve, reject) => {
        this.getFilm(filmUrl).subscribe( data => {
          this.films = data.results;
          resolve();
        });
      });
      this.loaderFilms = false;
   }

   changePage(page) {
     $('.pointer').removeClass('selected');
     $('#page' + page).attr('class', 'pointer waves-effect selected');

     this.id = 0;
     this.loader = true;
     // Obtendo lista de personagens de determinada página
     const personAsync = new Promise((resolve, reject) => {
        this.getPerson(page).subscribe( data => {
          this.data = data.results;
          resolve();
        });
      });
       personAsync.then((result) => {
         // Para cada personagem da lista, obtendo sua respectiva homeword e specie
         for ( let x = 0 ; x < this.data.length ; x++ ) {
           // Enviando requisição GET com o link de homeword específica
            this.getPlanet(this.data[x].homeworld).subscribe(
              data => {
                // Atribuindo nome da homeword ao Objeto de homewords
                this.planets[x] = data.name;
              }
            );
            // Enviando requisição GET com o link de specie específica
            this.getSpecie(this.data[x].species[0]).subscribe(
              data => {
                // Atribuindo nome da specie ao Objeto de species
                this.species[x] = data.name;
              }
            );
         }
         this.loader = false;
       });
   }

  vertBtn() {
    $('.pulse').removeClass('pulse');
    if ( $('.table').hasClass('table-changed') ) {
      $('.table').removeClass('table-changed');
    } else {
      $('.table').addClass('table-changed');
    }
    if ( $('.content').hasClass('content-changed') ) {
      $('.content').removeClass('content-changed');
    } else {
      $('.content').addClass('content-changed');
    }
  }

  ngAfterViewInit() {
    $('.modal').modal();
    $('.button-collapse').sideNav();
  }
}
