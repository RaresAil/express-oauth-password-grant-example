import { Injector } from 'adr-express-ts';
import { expect } from 'chai';

import DemoEntity from '../../domain/entities/DemoEntity';

describe('Check if entity was loaded', () => {
  it('Should be successfully', async () => {
    const entity = Injector.get<DemoEntity>('Entity.Demo');
    expect(entity!.IsLoaded).to.be.equal(true);
  });
});
