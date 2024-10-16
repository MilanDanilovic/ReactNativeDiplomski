class Place {
  constructor(title, description, imageUri, address, location) {
    this.id = new Date().toString() + Math.random().toString(); // pseudo unique id, not impossible to have duplicates
    this.title = title;
    this.description = description;
    this.imageUri = imageUri;
    this.address = address;
    this.location = location; // { lat: ..., lng: ... }
  }
}
