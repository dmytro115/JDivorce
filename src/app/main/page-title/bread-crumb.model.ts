export class BreadCrumb {
  url: string;
  title: string;

  constructor(title: string, url?: string) {
      this.title = title;
      this.url = url;
  }
}
