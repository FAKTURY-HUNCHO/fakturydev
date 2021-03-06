import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auction } from "./auction.modal";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService) { }

  // Define API
  apiURL = environment.apiUrl;


  // save auction to db
  addAuction(data: any)
    {
      return this.http.post(`${this.apiURL}/auctions/`, data)
        .subscribe((res: any) => {
          this.toastr.success(res.message);
        })
    }

    // update auction in db
  updateAuction(id : string, data: any)
  {
    return this.http.patch(`${this.apiURL}/auctions/${id}`, data);
  }

  updateAuctionBid(id : string, data: any)
  {
    return this.http.patch(`${this.apiURL}/auctions/bid/${id}`, data);
  }
  // delete auction from db
  deletePost(auctionId: string) {
    this.http
      .delete(`${this.apiURL}/auctions/` + auctionId)
      .subscribe((data: any) => {
      });
  }

  // HttpClient API get() method => Fetch All Auctions
  getPosts() {
    return this.http.get(`${this.apiURL}/auctions/`)

  }
  // get bid by id
  getAuctionBid(auctionId: string) {
    return this.http.get(`${this.apiURL}/auctions/` + auctionId)
  }
}