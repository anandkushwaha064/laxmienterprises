import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errors',
  standalone: true
})
export class ErrorsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    
    return null;
  }

}
