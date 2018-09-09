export class UserData {
  email: string;
  name: string;
  photoUrl: string;
  moderator: boolean;


  constructor(email: string, name: string, photoUrl: string, moderator: boolean) {
    this.email = email;
    this.name = name;
    this.photoUrl = photoUrl;
    this.moderator = moderator;
  }
}
