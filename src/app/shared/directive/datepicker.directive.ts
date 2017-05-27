import { Directive, ElementRef, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

declare var $: any;

@Directive({
    selector: '[datepicker]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting:
        forwardRef(() => DatePickerDirective),
        multi: true
    }]
})
export class DatePickerDirective implements ControlValueAccessor, AfterViewInit {
    value: string;

    constructor(protected el: ElementRef) { }

    ngAfterViewInit() {
        $(this.el.nativeElement).datetimepicker({
            // changeMonth: true,
            // yearRange: '1:100',
            // changeYear: true
            viewMode: 'days',
            format: 'MM-DD-YYYY'
        }).on('dp.change', e => {
            console.log('it is changed');
            this.onModelChange(e.target.value);
        });

    }

    onModelChange: Function = () => { };

    onModelTouched: Function = () => { };

    writeValue(val: string): void {
        this.value = val;
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    changeDate(setDate: any, elementId: string) {
        $('#' + elementId).data('DateTimePicker').date(new Date());
        $('#' + elementId).data('DateTimePicker').date(new Date(setDate));
    }
}
