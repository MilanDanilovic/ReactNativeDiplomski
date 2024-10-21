export class Place {
  constructor(title, description, imageUri, location, id, postedBy, status) {
    this.title = title;
    this.description = description;
    this.imageUri = imageUri;
    this.address = location.address;
    this.location = { lat: location.lat, lng: location.lng };
    this.id = new Date().toString() + Math.random().toString();
    this.postedBy = postedBy; // Who posted the problem
    this.status = status; // Problem status
  }
}
