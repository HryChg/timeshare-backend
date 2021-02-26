/* eslint-disable new-cap */
import {Expose} from "class-transformer";

/**
 * Room Model
 */
export default class UserModel {
  @Expose() userID!: string;
  @Expose() name!: string;
  @Expose() avatarURL!: string;
  @Expose() goal!: string; // TODO Extract Goal Into Its own Class

  // TODO Method to check if current avatar url is valid
}
