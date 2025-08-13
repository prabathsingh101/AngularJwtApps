import { MyCustomPipe } from './my-custom-pipe';

describe('MyCustomPipe', () => {
  it('create an instance', () => {
    const pipe = new MyCustomPipe();
    expect(pipe).toBeTruthy();
  });
});
