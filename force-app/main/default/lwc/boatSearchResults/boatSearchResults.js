import { LightningElement, wire } from "lwc";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
export default class BoatSearchResults extends LightningElement {
  boats = [];
  error;

  @wire(getBoats)
  wiredBoats({ error, data }) {
    if (data) {
      this.boats = data;
      console.log("CHECK :: " + JSON.stringify(this.boats));
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.boats = undefined;
    }
  }
}
