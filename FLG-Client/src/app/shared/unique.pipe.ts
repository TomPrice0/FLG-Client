import { Pipe, PipeTransform } from '@angular/core';
// https://stackoverflow.com/questions/43512528/how-go-get-ngfor-loop-unique-records
@Pipe({
  name: 'unique',
  pure: false
})
export class UniquePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    // Remove the duplicate elements
    let uniqueArray = value.filter(function (el, index, array) { 
      return array.indexOf (el) == index;
    });

    return uniqueArray;
  }
}