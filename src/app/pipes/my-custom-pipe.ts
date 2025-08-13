import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustom',
})
export class MyCustomPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return value.toUpperCase() + ' 🚀';
  }
}
