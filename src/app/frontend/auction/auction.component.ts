import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../shop/user.service';
import { Auction } from './auction.modal';
import { AuctionService } from './auctions.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Utils } from 'src/utils';
declare var $ : any;


@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {

  baseUrl = 'https://abcportal.ml/api';
  imageBaseUrl = 'https://abcportal.ml/images/'

  auctionForm!: FormGroup;
  bidForm!: FormGroup;
  showProductDes: any = {};
  formTitle: string = 'Add Auction';
  auctions:any;
  fileUrl: any;
  videoUrl:any;
  submitted = false;
  fileSrc: string = '';
  videoSrc: string = '';
  userRole: any;
  userEmail: string;
  userId: any;

  
  constructor(public auth: AuthService,public auctionService: AuctionService, private toastr: ToastrService) { }

  ngOnInit(): void {
      var emailPattern = "^[a-zA-Z]{1}[a-zA-Z0-9.\-_]*@[a-zA-Z]{1}[a-zA-Z.-]*[a-zA-Z]{1}[.][a-zA-Z]{2,}$";

      // this.auctionForm = new FormGroup({
      //   address : new FormControl('', [Validators.required]),
      //   email: new FormControl('',    [Validators.required,
      //                                   Validators.email,
      //                                   Validators.pattern(emailPattern)]),
      //   xrpBid: new FormControl('', [Validators.required]),
      //   fakBid: new FormControl('', [Validators.required])
      // })

      this.auctionForm = new FormGroup({
        _id: new FormControl(''),
        title: new FormControl('', [Validators.required]),
        file: new FormControl('', [Validators.required]),
        description: new FormControl('')
        });
        this.loadAuctions()
  }
  // convenience getter for easy access to Registration fields
  get f() { return this.auctionForm.controls; }
  


  show: boolean = false;
  clickEvent(){
    this.show = true;
    // $(".box__offer").css("display", "none");
       
  }
  changeTitle(value: string) {
    this.formTitle = value;
  }
  resetForm() {
    this.auctionForm.reset();
    this.changeTitle('Add Product');
    this.loadAuctions();
    this.fileSrc = '';
  }
  bidsForm(){

  }

  //update auction
  updateAuction(auction: Auction) {
    this.fileSrc = this.imageBaseUrl + auction.file;
    this.auctionForm.patchValue({
      _id: auction._id,
      title: auction.title,
      description: auction.description
    });
    this.changeTitle('Update Auction'); ;
  }

  // delete Auction
  removeAuction(auctionId: string) {
    Swal.fire(Utils.swalConfig()).then(result => {
      if (result.value && result.value === true) {
      this.auctionService.deletePost(auctionId);
      Utils.showSwalLoader();
      this.toastr.success('Auction Successfully Deleted.');
      this.loadAuctions();
      Utils.closeSwalLoader();
      }
    });
      
  }

  onUpdate(){
    let id = this.auctionForm.value._id;
      const formData = new FormData();
      formData.append('title', this.auctionForm.get('title')?.value);
      formData.append('file', this.fileUrl)
      formData.append('description', this.auctionForm.get('description')?.value);
      this.auctionService.updateAuction(id, formData);
      this.loadAuctions();
      $('#auctionModal').modal('hide');          
      this.resetForm();
  }
  onSubmit(value: Auction){
    this.submitted = true;
      // stop here if form is invalid
      if (this.auctionForm.invalid) {
          return;
      }
      //True if all the fields are filled 
      if(this.submitted) {
        const formData = new FormData();
        formData.append('title', this.auctionForm.get('title')?.value);
        formData.append('file',  this.fileUrl)
        formData.append('description', this.auctionForm.get('description')?.value);
        this.auctionService.addAuction(formData);
         // Close the stripe modal dialog window
      $('#auctionModal').modal('hide');
      setTimeout(()=>{                
        this.resetForm();
      }, 1000);
      }
  }
  onFileChange(event: any){
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const file:File = event.target.files[0];
      this.fileUrl = file
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.fileSrc = reader.result as string;
      };
    }  
  }
  loadAuctions() {
    return this.auctionService.getPosts().subscribe((data: any) => {
      this.auctions = data.Auction;
    });
  }
}
