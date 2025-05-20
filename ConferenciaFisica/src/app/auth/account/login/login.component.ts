
import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { SelectizeModel } from 'src/app/shared/microled-select/microled-select.component';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: UntypedFormGroup;
  formSubmitted: boolean = false;
  loading: boolean = false;
  returnUrl: string = '/';
  error: string = '';
  showPassword: boolean = false;

  terminais: SelectizeModel[] = [{ id: 1, label: 'IPA - Importação' }, { id: 2, label: 'REDEX - Exportação' }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: UntypedFormBuilder) { }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      terminal: [null, Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/tools';
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() { return this.loginForm.controls; }

  get terminalControl(): FormControl {
    return this.loginForm.get("terminal") as FormControl;
  }
  onSelectTerminalChange(value: any) {
    console.log(value);
  }
  /**
   * On submit form
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.loading = true;
      this.authenticationService.login(this.formValues.username?.value, this.formValues.password?.value, this.formValues.terminal?.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
            this.router.navigate([this.returnUrl]);
          },
          (error: any) => {
            this.error = error;
            this.loading = false;
          });
    }
  }

}
