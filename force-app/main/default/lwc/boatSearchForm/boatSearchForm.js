import { LightningElement, wire, track } from "lwc";
import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";

export default class BoatSearchForm extends LightningElement {
  selectedBoatTypeId = "";

  // Private
  error = undefined;

  @track
  searchOptions = [{ label: "All Types", value: "" }];

  @wire(getBoatTypes)
  boatTypes({ data, error }) {
    if (data) {
      let cloneOfSearchOptions = [...this.searchOptions];
      this.searchOptions = cloneOfSearchOptions.concat(
        data.map((item) => {
          return { label: item.Name, value: item.Id };
        })
      );
      // console.log("SEARCH OPTIONS :: " + JSON.stringify(this.searchOptions));
    } else if (error) {
      // console.log("Errorr :: " + JSON.stringify(error));
    }
  }

  // Fires event that the search option has changed.
  // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
  handleSearchOptionChange(event) {
    // Create the const searchEvent
    // searchEvent must be the new custom event search
    console.log("Select Boat Id :: " + event.detail.value);
    this.selectedBoatTypeId = event.detail.value;
    const searchEvent = new CustomEvent("search", {
      detail: {
        boatTypeId: this.selectedBoatTypeId
      },
      bubbles: true
    });
    this.dispatchEvent(searchEvent);
  }
}
