import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getToken()) {
    return router.createUrlTree(['/login']);
  }

  return authService.getProfile().pipe(
    map((user) => {
      if (user.role === 'admin') {
        return true;
      }

      return router.createUrlTree(['/home']);
    }),
    catchError((error) => of(router.createUrlTree(['/login']))),
  );
};
