import { Angular2ObservablesGroupbyPage } from './app.po';

describe('angular2-observables-groupby App', function() {
  let page: Angular2ObservablesGroupbyPage;

  beforeEach(() => {
    page = new Angular2ObservablesGroupbyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
