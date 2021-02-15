/**
 * Room Model that parses JSON into Rooms
 */
export class RoomModel {
  private readonly internalJson: any

  /**
   * Constructor for RoomModel
   * @param{obj} timerJson
   */
  constructor(timerJson: any) {
    this.internalJson = timerJson;
  }

  /**
   * @return{obj} return as json object
   */
  public toJSON(): any {
    return this.internalJson;
  }
}
