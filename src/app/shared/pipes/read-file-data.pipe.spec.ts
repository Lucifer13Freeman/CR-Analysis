import { ReadFileDataPipe } from './read-file-data.pipe';

describe('ReadFileDataPipe', () => {
  it('create an instance', () => {
    const pipe = new ReadFileDataPipe();
    expect(pipe).toBeTruthy();
  });
});
