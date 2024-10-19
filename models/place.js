export class Place {
  constructor(title, description, imageUri, location, id) {
    this.title = title;
    this.description = description;
    this.imageUri = imageUri;
    this.address = location.address;
    this.location = { lat: location.lat, lng: location.lng }; // { lat: 0.141241, lng: 127.121 }
    this.id = new Date().toString() + Math.random().toString(); // pseudo unique id, should be replaced with a real one from firebase
  }
}
