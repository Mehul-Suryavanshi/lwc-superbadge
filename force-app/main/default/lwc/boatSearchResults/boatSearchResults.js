import { LightningElement, wire, api, track } from "lwc";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import updateBoatList from "@salesforce/apex/BoatDataService.updateBoatList";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import { publish, MessageContext } from "lightning/messageService";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const SUCCESS_TITLE = "Success";
const MESSAGE_SHIP_IT = "Ship it!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Error";
const ERROR_VARIANT = "error";
export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  @api boatTypeId = "";
  @track boats;
  isLoading = false;
  @track draftValues = [];
  columns = [
    {
      label: "Name",
      fieldName: "Name",
      editable: true
    },
    {
      label: "Length",
      fieldName: "Length__c",
      editable: true
    },
    {
      label: "Price",
      fieldName: "Price__c",
      editable: true
    },
    {
      label: "Description",
      fieldName: "Description__c",
      editable: true
    }
  ];
  // wired message context
  @wire(MessageContext)
  messageContext;

  // wired getBoats method
  @wire(getBoats, {
    boatTypeId: "$boatTypeId"
  })
  wiredBoats(result) {
    this.boats = result;
    if (result.error) {
      this.error = result.error;
      this.boats = undefined;
    }
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api searchBoats(boatTypeId) {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    this.boatTypeId = boatTypeId;
  }

  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  async refresh() {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    await refreshApex(this.boats);
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }

  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    // console.log("SELECTED Boat Id :: " + event.detail.boatId);
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }

  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) {
    publish(this.messageContext, BOATMC, {
      recordId: boatId
    });
    // explicitly pass boatId to the parameter recordId
  }

  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    this.notifyLoading(true);
    const updatedFields = event.detail.draftValues;
    console.log("CHECK :: 11 " + JSON.stringify(updatedFields));
    this.notifyLoading(false);
    // Update the records via Apex
    updateBoatList({ data: updatedFields })
      .then(() => {
        this.refresh();

        // Show toast message
        this.dispatchEvent(
          new ShowToastEvent({
            title: SUCCESS_TITLE,
            message: MESSAGE_SHIP_IT,
            variant: SUCCESS_VARIANT
          })
        );
      })
      .catch((error) => {
        this.error = error;

        // Show toast message
        this.dispatchEvent(
          new ShowToastEvent({
            title: ERROR_TITLE,
            message: error.body.message,
            variant: ERROR_VARIANT
          })
        );
      })
      .finally(() => {
        this.draftValues = [];
      });
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    let eventType = isLoading ? "loading" : "doneloading";
    const event = new CustomEvent(eventType);
    this.dispatchEvent(event);
  }
}
