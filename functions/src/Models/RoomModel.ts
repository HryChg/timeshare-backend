/* eslint-disable new-cap */
import {Expose} from "class-transformer";

/**
 * Room Model
 */
export default class RoomModel {
  @Expose() title!: string;
  @Expose() workTimer!: number;
  @Expose() breakTimer!: number;
  @Expose() onBreak!: boolean;
  @Expose() timeLeft!: number;
  @Expose() userIDs!: [string];
}
