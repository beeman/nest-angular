import { Component, OnInit } from '@angular/core';
import { RecipeItem } from './recipes-list/recipe-item/recipe-item.component';
import { RecipesService } from '../../services/recipes.service';
import { AuthService } from '../../services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  providers: [RecipesService]
})
export class RecipesComponent implements OnInit {
  recipes: RecipeItem[];

  emailFormControl = new FormControl('', [
    Validators.email,
    Validators.required
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  email: string;
  password: string;

  constructor(
    private readonly recipesService: RecipesService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (Object.keys(params).length) {
        this.authService.requestFacebookAccessToken(params.code)
          .subscribe((params: Params) => {
            this.authService.facebookSignIn(params.access_token)
              .subscribe((params: Params) => {
                this.router.navigate(['/']);
              });
          });
      }
    });

    this.recipesService.getRecipes()
      .then((recipes: RecipeItem[]) => this.recipes = recipes);
  }

  testApi() {
    const request: XMLHttpRequest = new XMLHttpRequest();

    request.onload = (e: Event) => {
      console.log(e);
    };

    request.open('GET', 'api/getStuff', true);
    request.send();
  }

  signUp() {
    this.authService.signUp(this.email, this.password);
  }

  signIn() {
    this.authService.signIn(this.email, this.password);
  }

  getProtected() {
    this.authService.getProtected()
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  facebookLogin() {
    this.authService.requestFacebookRedirectUri()
      .subscribe((response: {redirect_uri: string}) => {
        window.location.replace(response.redirect_uri);
      });
  }
}
