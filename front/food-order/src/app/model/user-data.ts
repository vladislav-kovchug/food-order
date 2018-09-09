export class UserData {
  email: string;
  name: string;
  photoUrl: string;
  moderator?: boolean;

  constructor(email: string, name: string, photoUrl: string) {
    this.email = email;
    this.name = name;
    this.photoUrl = photoUrl;
  }

}
