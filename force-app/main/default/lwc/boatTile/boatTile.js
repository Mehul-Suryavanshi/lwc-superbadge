import { LightningElement, api } from "lwc";
const TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
const TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";

export default class BoatTile extends LightningElement {
  @api boat;
  // = {
  //   Name: "Sounder",
  //   Description__c: "Life without a boat is not fun. I love this boat.",
  //   Geolocation__Latitude__s: 47.630068,
  //   Geolocation__Longitude__s: -122.335491,
  //   Picture__c: "/resource/PleasureBoats/pleasureboat3.png",
  //   Contact__c: "003dM000000a913QAA",
  //   BoatType__c: "a01dM000003nVklQAE",
  //   Length__c: 15,
  //   Price__c: 353000,
  //   Id: "a02dM000000TBYJQA4",
  //   Contact__r: { Name: "Rachel King", Id: "003dM000000a913QAA" },
  //   BoatType__r: { Name: "Pleasure Boat", Id: "a01dM000003nVklQAE" }
  // };
  @api selectedBoatId;

  // Getter for dynamically setting the background image for the picture
  get backgroundStyle() {
    return `background-image:url(${this.boat.Picture__c})`;
  }

  // Getter for dynamically setting the tile class based on whether the
  // current boat is selected
  get tileClass() {
    return this.selectedBoatId
      ? TILE_WRAPPER_SELECTED_CLASS
      : TILE_WRAPPER_UNSELECTED_CLASS;
  }

  // Fires event with the Id of the boat that has been selected.
  selectBoat() {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.selectedBoatId = !this.selectedBoatId;
    const boatEvent = new CustomEvent("boatselect", {
      detail: {
        boatId: this.boat.Id
      },
      bubbles: true
    });

    // Dispatches the event.
    this.dispatchEvent(boatEvent);
  }
}
