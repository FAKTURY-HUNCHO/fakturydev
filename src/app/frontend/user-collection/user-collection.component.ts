import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

import { Utils } from 'src/utils';
import { OrderService } from '../shop/order.service';
import { UserService } from '../shop/user.service';
//import * as $ from 'jquery';
declare var $ : any;

@Component({
  selector: 'app-user-collection',
  templateUrl: './user-collection.component.html',
  styleUrls: ['./user-collection.component.css']
})
export class UserCollectionComponent implements OnInit {

  baseUrl = environment.apiUrl;
  imageBaseUrl = environment.imageBaseUrl;
  profileJson!: string;
  userForm: FormGroup;
  userEmail: string;
  user: any;
  xrplAddress: any;
  firstName: string;
  lastName: string;
  orders: any;

  constructor(public auth: AuthService, private userService: UserService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(
      (profile) => {
        if (profile) {
          this.userEmail = profile.email;
          this.getUserData(profile.email)
          this.getUserOrder(profile.email);
        }
        (this.profileJson = JSON.stringify(profile, null, 2))
      }
    );
    //Add Stripe form validations
    this.userForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      xrplAddress: new FormControl(''),
      });
  }
  getUserData(email: string) {
      this.userService.getUser(email).subscribe((res: any) => {
        this.xrplAddress = res.User.xrplAddress;
        this.firstName = res.User.firstName;
        this.lastName = res.User.lastName;
        this.userForm.patchValue({
          firstName: res.User.firstName,
          lastName: res.User.lastName,
          xrplAddress: res.User.xrplAddress
        });
      });
  }

  getUserOrder(email: string) {
    Utils.showSwalLoader();
    this.orderService.getOrder(email).subscribe((res: any) => {
      this.orders = res.Order
      Utils.closeSwalLoader();
    })
  }

    //Add stripe form actions
    get g() { return this.userForm.controls; }

    //update user
    updateUserProfile(user) {
      Utils.showSwalLoader();
      this.userService.updateUser(this.userEmail, user)
        // Close the userForm modal dialog window
        $('#stripeModal').modal('hide');

        setTimeout(()=>{                
          this.resetForm();
        });
        Utils.closeSwalLoader();
      }
    

    //reset form
    resetForm() {
      this.userForm.reset();
      this.ngOnInit()
    }

}
