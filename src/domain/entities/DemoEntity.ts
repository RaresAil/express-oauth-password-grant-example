import { InjectedEntity } from 'adr-express-ts/lib/@types';
import { Entity, Inject, Retrive } from 'adr-express-ts';

@Inject
@Entity('Demo')
export default class DemoEntity implements InjectedEntity {
  @Retrive('Mongoose')
  private mongoose?: any;

  // -- For Tests --
  private _loaded: boolean = false;

  public get IsLoaded() {
    return this._loaded;
  }

  async onLoad(): Promise<void> {
    this._loaded = true; // -- For Tests --

    if (!this.mongoose) {
      return;
    }

    // Here you have to initialize your model.
    // The order of execution is onLoad (from enities) -> onReady (from classes)
    // Once loaded, most of the ORMs already have your model saved in a variable
    // (Mongoose have mongoose.models)
    // If you need the entity class, you can use
    // @Retrive('Entity.{NAME_HERE}')
    // Mongoose is not installed by default, if you need to use mongoose,
    // in index.ts, at the variables cateogry, use
    // Injector.inject('Mongoose', mongoose, InjectType.Variable);

    // e.g. there is a Mongoose model example:

    // const { ObjectId } = Schema as any;

    // this.mongoose.model('User', new Schema({
    //   id: ObjectId,
    //   email: {
    //     type: String,
    //     min: 3,
    //     max: 255,
    //     required: true
    //   },
    //   password: {
    //     type: String,
    //     min: 8,
    //     required: true
    //   }
    // }));
  }
}
