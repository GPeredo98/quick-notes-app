import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'qn-register-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, FormsModule, RouterLink],
  templateUrl: './register.page.html',
})
export class RegisterPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly errorMessage = signal('');
  protected readonly registerIcon = UserPlus;

  protected submit(): void {
    const result = this.authService.register(this.email(), this.password());
    if (!result.success) {
      this.errorMessage.set(result.message ?? 'Unable to create account.');
      return;
    }

    this.errorMessage.set('');
    this.router.navigate(['/']);
  }
}
