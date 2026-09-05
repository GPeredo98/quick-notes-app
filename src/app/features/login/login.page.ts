import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LogIn, LucideAngularModule, Mail, Lock } from 'lucide-angular';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'qn-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, FormsModule, RouterLink],
  templateUrl: './login.page.html',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly errorMessage = signal('');
  protected readonly loginIcon = LogIn;
  protected readonly mailIcon = Mail;
  protected readonly lockIcon = Lock;

  protected async submit(): Promise<void> {
    const result = await this.authService.login(this.email(), this.password());
    if (!result.success) {
      this.errorMessage.set(result.message ?? 'Unable to sign in.');
      return;
    }

    this.errorMessage.set('');
    this.router.navigate(['/']);
  }
}
