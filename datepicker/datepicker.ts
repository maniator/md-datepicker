import {
  AfterContentInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  Optional,
  EventEmitter,
  ViewEncapsulation,
  NgModule,
  ModuleWithProviders,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as moment from 'moment';

function coerceBooleanProperty(value: any): boolean {
    return value != null && `${value}` !== 'false';
}

@Component({
  selector: 'datepicker',
  templateUrl: 'datepicker.html',
  styleUrls: ['datepicker.scss'],
  host: {
    'role': 'datepicker',
    '[id]': 'id',
    '[class.datepicker-disabled]': 'disabled',
    '[attr.tabindex]': 'disabled ? -1 : tabindex',
    '[attr.aria-label]': 'placeholder',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': '_control?.invalid || "false"',
  },
  encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent implements AfterContentInit, ControlValueAccessor {
    protected _format: string = 'MM/DD/YYYY';
    protected _value: string = '';
    protected _viewValue: string = '';
    protected _readonly: boolean = false;
    protected _required: boolean = false;
    protected _disabled: boolean = false;

    @Input() placeholder?: string = "Please enter date in MM/DD/YYYY format";

    @Output() change: EventEmitter<any> = new EventEmitter<any>();

    _onChange = (value: any) => {};
    _onTouched = () => {};

    constructor(private element: ElementRef, @Optional() public _control: NgControl) {
        if (this._control) {
          this._control.valueAccessor = this;
        }
    }

    @Input()
    get format () {
        return this._format;
    }
    set format (format) {
        this._format = format;
    }

    @Input()
    get value(): any { return this._value; }
    set value(value: any) {
        this._value = value;

        this.formatValue();
    }

    @Input()
    get readonly(): boolean { return this._readonly; }
    set readonly(value) { this._readonly = coerceBooleanProperty(value); }

    @Input()
    get required(): boolean { return this._required; }
    set required(value) { this._required = coerceBooleanProperty(value); }

    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value) { this._disabled = coerceBooleanProperty(value); }

    @HostListener('input', ['$event.target.value'])
    onInput (value: string) {
        const date = moment(value, this._format);

        // make sure the passed value passes the check for date
        if (date.format(this._format) === value) {
            if (date.isValid()) {
                this._value = date.format('YYYY-MM-DD');
                this._onChange(this.value);
                this.change.emit(this.value);
            }
        } else {
            this._control.control.setErrors({
                message: 'The date is invalid',
            });
        }

        this._onTouched();
    }

    onFocus (event) {

    }

    onBlur () {
        this._onTouched();
    }

    ngAfterContentInit () { }

    writeValue (value: string) {
        this._value = value;

        this.formatValue();
    }

    registerOnChange(fn: (value: any) => void): void { this._onChange = fn; }

    registerOnTouched(fn: () => {}): void { this._onTouched = fn; }

    formatValue () {
        this._viewValue = moment(this._value).format(this._format);
    }
}

@NgModule({
  imports: [CommonModule],
  exports: [DatepickerComponent],
  declarations: [DatepickerComponent],
})
export class DatepickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DatepickerModule,
    };
  }
}
