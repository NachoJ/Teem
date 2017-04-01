import { TeamAngularPage } from './app.po';

describe('team-angular App', () => {
  let page: TeamAngularPage;

  beforeEach(() => {
    page = new TeamAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
