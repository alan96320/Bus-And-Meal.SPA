import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  constructor() {}

  success(message: string) {
    // tslint:disable-next-line: no-use-before-declare
    Toast.fire({
      icon: 'success',
      title: message
    });
  }
  successAdd(message: string) {
    // tslint:disable-next-line: no-use-before-declare
    Toast.fire({
      icon: 'success',
      title: message
    });
  }

  error(message: string) {
    // tslint:disable-next-line: no-use-before-declare
    Toast.fire({
      icon: 'error',
      text: message
    });
  }

  warning(message: string) {
    // tslint:disable-next-line: no-use-before-declare
    Toast.fire({
      icon: 'warning',
      title: message
    });
  }

  warningDel() {
    // tslint:disable-next-line: no-use-before-declare
    Toast.fire({
      icon: 'warning',
      title: 'Your file has been deleted.'
    });
  }

  message(message: string) {
    // tslint:disable-next-line: no-use-before-declare
    Toast.fire({
      icon: 'info',
      title: message
    });
  }

  errors(message: any) {
    console.log('n=>' + message.status);

    const a = Object.values(message);
    // tslint:disable-next-line: no-use-before-declare
    Toast.fire({
      icon: 'warning',
      title: a[0],
    });
  }

}

const Toast = swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: toast => {
    toast.addEventListener('mouseenter', swal.stopTimer);
    toast.addEventListener('mouseleave', swal.resumeTimer);
  }
});
