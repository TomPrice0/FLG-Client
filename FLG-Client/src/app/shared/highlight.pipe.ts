import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}

  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }
    const terms=args.split(' ').join('|');    
    const replacedValue = value.replace(new RegExp(terms, 'gi'), (match) => "<b>" + match + "</b>")
    return this.sanitizer.bypassSecurityTrustHtml(replacedValue)
  }
}
