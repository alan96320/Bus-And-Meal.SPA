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
    const a = message.replace(/;/g, ' <br> ');
    // tslint:disable-next-line: no-use-before-declare
    Toast.fire({
      icon: 'error',
      html : a
    });
  }

  warning(message: string) {
    // tslint:disable-next-line: no-use-before-declare
    Toast.fire({
      icon: 'error',
      title: message
    });
  }

  warningDel() {
    // tslint:disable-next-line: no-use-before-declare
    Toast.fire({
      icon: 'error',
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

}

const Toast = swal.mixin({
  toast: true,
  position: 'center-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: toast => {
    toast.addEventListener('mouseenter', swal.stopTimer);
    toast.addEventListener('mouseleave', swal.resumeTimer);
  }
});
