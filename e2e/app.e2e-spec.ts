import { ImpacMaterialPage } from './app.po';

describe('impac-material App', () => {
  let page: ImpacMaterialPage;

  beforeEach(() => {
    page = new ImpacMaterialPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
