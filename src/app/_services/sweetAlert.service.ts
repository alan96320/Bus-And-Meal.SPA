import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
   
   
export class SweetAlertService {

   constructor() { }

   success(message: string) {
      swal.fire({
         position: 'center',
         icon: 'success',
         title: message,
         background: '#00000000',
         showConfirmButton: false,
         timer: 1500
      })
   }
   successAdd(message: string) {
      swal.fire({
         position: 'bottom-end',
         icon: 'success',
         title: message,
         background: '#00000000',
         showConfirmButton: false,
         timer: 1500
      })
   }

   error(message: string) {
      swal.fire({
         position: 'center',
         icon: 'error',
         title: 'Opsss',
         text: message,
         background: '#00000000',
         showConfirmButton: false,
         timer: 5000
      })
   }

   warning(message: string) {
      swal.fire({
         position: 'center',
         icon: 'warning',
         title: message,
         background: '#00000000',
         showConfirmButton: false,
         timer: 1500
      })
   }

   warningDel() {
      swal.fire({
         position: 'bottom-end',
         icon: 'warning',
         title: 'Deleted!',
         text: "Your file has been deleted.",
         background: '#00000000',
         showConfirmButton: false,
         timer: 1500
      })
   }

   message(message: string) {
      swal.fire({
         position: 'center',
         icon: 'info',
         title: message,
         background: '#00000000',
         showConfirmButton: false,
         timer: 5000
      })
   }

   

}